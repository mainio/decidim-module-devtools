import { StaticConfigLoader, HtmlValidate } from "src/vendor/html-validate";
import icon from "src/decidim/icon"
import { isNewDesign } from "src/decidim/devtools/utils";

let REDESIGN = null;

const createFragment = (html) => {
  return document.createRange().createContextualFragment(html);
};

const escapeHTML = (text) => {
  let div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

const getIcon = (iconName) => {
  if (REDESIGN) {
    if (iconName === "check") {
      return icon("check-fill", { class: "icon w-4 h-4 fill-current" });
    }
    return icon("error-warning-fill", { class: "icon w-4 h-4 mr-1 fill-current" })
  }

  return icon(iconName);
}

const loader = new StaticConfigLoader({
  extends: ["html-validate:standard"],
  elements: ["html5"]
});
const htmlvalidate = new HtmlValidate(loader);

const generateDoctype = () => {
  let doctype = `<!DOCTYPE ${document.doctype.name}`;
  if (document.doctype.publicId) {
    doctype += ` PUBLIC "${document.doctype.publicId}"`;
  } else if (document.doctype.systemId) {
    doctype += ` SYSTEM "${document.doctype.systemId}"`;
  }

  return `${doctype}>`;
}

/**
 * Validtes the given string using HTML validate.
 *
 * @param {String} string  The string to validate
 * @returns {Object} Object containing the valid status as well as the
 *   validation report with detailed information about validation issues.
 */
const htmlValidateString = async (string) => {
  const report = await htmlvalidate.validateString(string);

  // Filter false positives from the list.
  for (let idx = 0; idx < report.results.length; idx += 1) {
    const result = report.results[idx];
    result.messages = result.messages.filter((message) => {
      if (message.ruleId === "valid-autocomplete") {
        // This is a Rails-specific "hack" that fixes a bug in Firefox.
        //
        // For further details, see:
        // https://github.com/rails/rails/issues/46405
        // https://bugzilla.mozilla.org/show_bug.cgi?id=520561
        return message.context.what !== '<input type="hidden">';
      } else if (message.ruleId === "multiple-labeled-controls") {
        // Rails adds hidden inputs together with checkbox elements under the
        // same `<label>` element. This is valid HTML and seems like a bug in
        // html-validate.
        //
        // For further details, see:
        // https://gitlab.com/html-validate/html-validate/-/issues/251
        const label = document.querySelector(message.selector);
        if (!label) {
          return true;
        }

        const labelFor = label.getAttribute("for");
        if (labelFor) {
          const target = document.getElementById(labelFor);
          return !(target instanceof HTMLElement);
        }
        // Check if the `<label>` has more than one non-hidden inputs.
        const validDecendants = [...label.querySelectorAll("input, select, textarea")].filter((el) => {
          return el.nodeName !== "INPUT" || el.type?.toLowerCase() !== "hidden";
        });
        return validDecendants.length > 1;
      }

      return true;
    });
    report.results[idx] = result;
  }
  report.results = report.results.filter((result) => result.messages.length > 0);

  return report
}

/**
 * Validates the given string using the W3C nu validator.
 *
 * This does an external request to the W3C validation endpoint and does not
 * provide the selectors for the elements which makes it harder to display in an
 * understandable format.
 *
 * However, the W3C validator is generally seen as the de-facto and it produces
 * different errors than the html-validate library which is why it can be
 * sometimes useful.
 *
 * @param {String} string The string to validate.
 * @returns {Object} Object containing the valid status as well as the possible
 *   messages returned by the validator.
 */
const w3cValidateString = async (string) => {
  const response = await fetch(
    "https://validator.w3.org/nu/?out=json&level=error",
    {
      method: "POST",
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      },
      body: string
    }
  )
  if (response.status !== 200) {
    console.error(`Invalid response code from W3C validator: ${response.status}`);
    return {
      valid: null,
      error: true,
      messages: [
        { type: "connection", message: "Could not connect to W3C validator.", extract: response.status }
      ]
    };
  }

  const data = await response.json();

  // Filter false positives similarly to the other html-validate. This is a
  // valid HTML validation error but fixing it would break Firefox due to a bug
  // (see the related comment at `validateStringHtmlValidate`).
  data.messages = data.messages.filter((message) => {
    if (message.type === "error" && message.message === "An “input” element with a “type” attribute whose value is “hidden” must not have an “autocomplete” attribute whose value is “on” or “off”.") {
      return false;
    }
    return true;
  })

  const valid = !data.messages.some((item) => item.type === "error");
  return {
    valid,
    messages: data.messages
  }
};

const validateString = async (string) => {
  const report = await htmlValidateString(string);
  const w3c = await w3cValidateString(string);

  return {
    valid: (report.valid || report.results.every((result) => result.messages.length < 1)) && w3c.valid,
    results: report.results,
    w3cMessages: w3c.messages
  }
}

const validateDocument = async () => {
  const report = await validateString(`${generateDoctype()}\n${document.documentElement.outerHTML}`);

  document.body.removeAttribute("data-devtools-status");

  const reportNode = document.getElementById("html-validator-report");
  const badgeNode = document.getElementById("html-validator-badge");

  badgeNode.innerHTML = "";
  badgeNode.classList.remove("devtools-badge--success", "devtools-badge--error");

  reportNode.innerHTML = "";

  if (report.valid) {
    badgeNode.classList.add("devtools-badge--success");
    badgeNode.append(createFragment(`
      <span class="devtools-badge__title">HTML</span>
      <span class="devtools-badge__info">${getIcon("check")}</span>
    `));
    reportNode.append(createFragment(`
      <div class="devtools-panel__item">
        <h2 class="h5">Valid HTML</h2>
        <p>${(new Date()).toISOString()}</p>
        <p><button type="button" id="html-validator-revalidate">Revalidate</button></p>
      </div>
    `));
  } else {
    badgeNode.classList.add("devtools-badge--error");
    badgeNode.append(createFragment(`
      <span class="devtools-badge__title">HTML</span>
      <span class="devtools-badge__info">${getIcon("warning")}</span>
    `));
    reportNode.append(createFragment(`
      <div class="devtools-panel__item">
        <h2 class="h5">Invalid HTML report</h2>
        <p>${(new Date()).toISOString()}</p>
        <p><button type="button" id="html-validator-revalidate">Revalidate</button></p>
      </div>
    `));
    const grouppedResults = {};
    report.results.forEach((result) => {
      result.messages.forEach((message) => {
        if (!grouppedResults[message.ruleId]) {
          grouppedResults[message.ruleId] = [];
        }
        grouppedResults[message.ruleId].push(message);
      });
    });

    Object.keys(grouppedResults).forEach((key) => {
      const message = grouppedResults[key][0];
      const selectors = grouppedResults[key].map((msg) => msg.selector);

      reportNode.append(createFragment(`
        <div class="devtools-panel__item">
          <h3 class="h6">${escapeHTML(key)}</h3>
          <p>${escapeHTML(message.message)}</p>
          <p><a href="${escapeHTML(message.ruleUrl)}" target="_blank">Read more about <code>${escapeHTML(key)}</code></a></p>
          <div>
            <p>Nodes:</p>
            <ul>
              ${selectors.map((selector) => `<li><button type="button">${escapeHTML(selector)}</button></li>`).join("")}
            </ul>
          </div>
        </div>
      `));
    });

    report.w3cMessages.forEach((message) => {
      reportNode.append(createFragment(`
        <div class="devtools-panel__item">
          <h3 class="h6">${escapeHTML(message.type)}: ${escapeHTML(message.message)}</h3>
          <p><code>${escapeHTML(message.extract)}</code></p>
        </div>

      `));
    });

    reportNode.querySelectorAll("ul li button").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        const target = document.querySelector(btn.innerText);
        if (!target) {
          return;
        }

        target.scrollIntoView();
      });
    });
  }

  const revalidate = document.getElementById("html-validator-revalidate");
  revalidate.addEventListener("click", (ev) => {
    ev.preventDefault();
    if (revalidate.getAttribute("disabled")) {
      return;
    }

    document.body.setAttribute("data-devtools-status", "loading");
    revalidate.setAttribute("disabled", "disabled");
    setTimeout(() => validateDocument(), 100);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  REDESIGN = isNewDesign();

  if (!document.getElementById("html-validator-report")) {
    const mainContainer = document.querySelector("main") || document.querySelector("[role='main']") || document.body;
    mainContainer.append(createFragment(`
      <div id="html-validator-report" class="devtools-panel devtools-panel--right" lang="en"></div>
    `));
  }
  if (!document.getElementById("html-validator-badge")) {
    const footerContainer = document.querySelector("footer") || document.querySelector("[role='contentinfo']") || document.body;
    footerContainer.append(createFragment(`
      <div lang="en">
        <button id="html-validator-badge" class="devtools-badge devtools-badge--bottom-right" type="button" aria-label="Show HTML validation report"></button>
      </div>
    `));
  }

  const badgeNode = document.getElementById("html-validator-badge");
  badgeNode.addEventListener("click", (ev) => {
    ev.preventDefault();
    if (document.body.getAttribute("data-html-report-visible")) {
      document.body.removeAttribute("data-html-report-visible");
      badgeNode.setAttribute("aria-label", "Show HTML validation report");
    } else {
      document.body.setAttribute("data-html-report-visible", true);
      badgeNode.setAttribute("aria-label", "Hide HTML validation report");
    }
  });

  // Give time for the page to render and load its JS
  setTimeout(() => validateDocument(), 2000);
});
