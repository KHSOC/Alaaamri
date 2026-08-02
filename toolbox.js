"use strict";

(() => {
  const language = document.documentElement.lang === "ar" ? "ar" : "en";
  const t = (ar, en) => language === "ar" ? ar : en;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const text = (selector, value) => {
    const element = $(selector);
    if (element) element.textContent = value;
  };
  const normalize = (value) => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0640\u064B-\u065F\u0670]/g, "")
    .toLowerCase();

  const toast = (message) => {
    let element = $("[data-toolbox-toast]");
    if (!element) {
      element = document.createElement("div");
      element.className = "toolbox-toast";
      element.dataset.toolboxToast = "";
      element.setAttribute("role", "status");
      element.setAttribute("aria-live", "polite");
      document.body.append(element);
    }
    element.textContent = message;
    element.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => element.classList.remove("show"), 2200);
  };

  const safeCopy = async (value) => {
    const copied = window.khalidCopyText
      ? await window.khalidCopyText(value)
      : false;
    toast(copied ? t("تم النسخ", "Copied") : t("تعذر النسخ", "Copy failed"));
  };

  const getUsage = () => {
    try {
      return JSON.parse(localStorage.getItem("khalidToolUsage") || "{}");
    } catch (_) {
      return {};
    }
  };

  const track = (tool) => {
    if (!tool) return;
    try {
      const usage = getUsage();
      usage[tool] = Number(usage[tool] || 0) + 1;
      localStorage.setItem("khalidToolUsage", JSON.stringify(usage));
      renderUsage();
    } catch (_) {}
  };

  const renderUsage = () => {
    const list = $("[data-usage-list]");
    if (!list) return;
    const entries = Object.entries(getUsage()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    list.replaceChildren();
    if (!entries.length) {
      const item = document.createElement("li");
      item.textContent = t("لا توجد استخدامات مسجلة في هذا المتصفح بعد.", "No usage has been recorded in this browser yet.");
      list.append(item);
      return;
    }
    entries.forEach(([name, count]) => {
      const item = document.createElement("li");
      const label = document.createElement("span");
      const value = document.createElement("strong");
      label.textContent = name;
      value.textContent = String(count);
      item.append(label, value);
      list.append(item);
    });
  };

  $$('[data-copy-output]').forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.copyOutput || "");
      if (target) safeCopy(target.value || target.textContent || "");
    });
  });

  $$('[data-track-tool]').forEach((element) => {
    element.addEventListener("click", () => track(element.dataset.trackTool));
  });

  // Toolbox search/filter.
  const toolboxSearch = $("[data-toolbox-search]");
  const moduleCount = $("[data-toolbox-result-count]");
  const modules = $$("[data-tool-module]");
  const applyModuleSearch = () => {
    if (!toolboxSearch) return;
    const query = normalize(toolboxSearch.value.trim());
    let visible = 0;
    modules.forEach((module) => {
      const haystack = normalize(`${module.dataset.keywords || ""} ${module.textContent}`);
      const show = !query || haystack.includes(query);
      module.hidden = !show;
      if (show) visible += 1;
    });
    if (moduleCount) {
      moduleCount.textContent = t(`${visible} أداة ظاهرة`, `${visible} tools visible`);
    }
  };
  toolboxSearch?.addEventListener("input", applyModuleSearch);
  applyModuleSearch();

  // IPv4 helpers.
  const parseIPv4 = (value) => {
    const parts = String(value || "").trim().split(".");
    if (parts.length !== 4) return null;
    const numbers = parts.map((part) => Number(part));
    if (numbers.some((number, index) => !Number.isInteger(number) || number < 0 || number > 255 || String(number) !== String(Number(parts[index])))) {
      return null;
    }
    return numbers;
  };

  const ipv4ToInt = (parts) => (((parts[0] * 256 + parts[1]) * 256 + parts[2]) * 256 + parts[3]) >>> 0;
  const intToIPv4 = (value) => [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
  const prefixToMask = (prefix) => prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
  const isPrivateIPv4 = (parts) => parts[0] === 10
    || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
    || (parts[0] === 192 && parts[1] === 168)
    || parts[0] === 127
    || (parts[0] === 169 && parts[1] === 254);

  $("[data-subnet-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-subnet-input]");
    const output = $("[data-subnet-output]");
    if (!input || !output) return;
    const [ipText, prefixText = "24"] = input.value.trim().split("/");
    const parts = parseIPv4(ipText);
    const prefix = Number(prefixText);
    if (!parts || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
      output.textContent = t("أدخل عنوان IPv4 صحيحًا مع CIDR مثل 192.168.1.10/24", "Enter a valid IPv4 address with CIDR, such as 192.168.1.10/24");
      return;
    }

    const ip = ipv4ToInt(parts);
    const mask = prefixToMask(prefix);
    const wildcard = (~mask) >>> 0;
    const network = (ip & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const total = 2 ** (32 - prefix);
    const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : Math.max(total - 2, 0);
    const first = prefix >= 31 ? network : network + 1;
    const last = prefix >= 31 ? broadcast : broadcast - 1;
    const scope = isPrivateIPv4(parts) ? t("خاص / محلي", "Private / local") : t("عام", "Public");
    const binary = parts.map((part) => part.toString(2).padStart(8, "0")).join(".");

    output.textContent = [
      `${t("العنوان", "Address")}: ${intToIPv4(ip)}/${prefix}`,
      `${t("النطاق", "Scope")}: ${scope}`,
      `${t("الشبكة", "Network")}: ${intToIPv4(network)}`,
      `${t("قناع الشبكة", "Subnet mask")}: ${intToIPv4(mask)}`,
      `${t("القناع العكسي", "Wildcard mask")}: ${intToIPv4(wildcard)}`,
      `${t("البث", "Broadcast")}: ${intToIPv4(broadcast)}`,
      `${t("أول عنوان قابل للاستخدام", "First usable")}: ${intToIPv4(first)}`,
      `${t("آخر عنوان قابل للاستخدام", "Last usable")}: ${intToIPv4(last)}`,
      `${t("إجمالي العناوين", "Total addresses")}: ${total.toLocaleString()}`,
      `${t("العناوين القابلة للاستخدام", "Usable addresses")}: ${usable.toLocaleString()}`,
      `${t("ثنائي", "Binary")}: ${binary}`
    ].join("\n");
    track(t("حاسبة الشبكات", "Subnet calculator"));
  });

  $("[data-ip-binary-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-ip-binary-input]");
    const output = $("[data-ip-binary-output]");
    if (!input || !output) return;
    const parts = parseIPv4(input.value);
    output.textContent = parts
      ? parts.map((part) => part.toString(2).padStart(8, "0")).join(".")
      : t("عنوان IPv4 غير صحيح", "Invalid IPv4 address");
    track(t("تحويل IP إلى ثنائي", "IP to binary"));
  });

  const validIPv6 = (input) => {
    const value = String(input || "").trim().split("%")[0];
    if (!value || (value.match(/::/g) || []).length > 1) return false;
    const validatePart = (part) => /^[0-9a-f]{1,4}$/i.test(part);
    if (value.includes("::")) {
      const [left, right] = value.split("::");
      const leftParts = left ? left.split(":") : [];
      const rightParts = right ? right.split(":") : [];
      return leftParts.every(validatePart) && rightParts.every(validatePart) && leftParts.length + rightParts.length < 8;
    }
    const parts = value.split(":");
    return parts.length === 8 && parts.every(validatePart);
  };

  $("[data-ip-validator-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-ip-validator-input]");
    const output = $("[data-ip-validator-output]");
    if (!input || !output) return;
    const value = input.value.trim();
    const ipv4 = parseIPv4(value);
    if (ipv4) {
      output.textContent = t(`IPv4 صحيح — ${isPrivateIPv4(ipv4) ? "خاص/محلي" : "عام"}`, `Valid IPv4 — ${isPrivateIPv4(ipv4) ? "private/local" : "public"}`);
    } else if (validIPv6(value)) {
      output.textContent = t("IPv6 صحيح", "Valid IPv6");
    } else {
      output.textContent = t("العنوان غير صحيح", "Invalid IP address");
    }
    track(t("التحقق من IP", "IP validator"));
  });

  $("[data-mac-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-mac-input]");
    const format = $("[data-mac-format]");
    const output = $("[data-mac-output]");
    if (!input || !format || !output) return;
    const clean = input.value.replace(/[^0-9a-f]/gi, "").toUpperCase();
    if (clean.length !== 12) {
      output.textContent = t("أدخل 12 رقمًا سداسيًا عشريًا.", "Enter exactly 12 hexadecimal characters.");
      return;
    }
    let formatted = clean;
    if (format.value === "colon") formatted = clean.match(/.{2}/g).join(":");
    if (format.value === "dash") formatted = clean.match(/.{2}/g).join("-");
    if (format.value === "dot") formatted = clean.match(/.{4}/g).join(".");
    const firstByte = parseInt(clean.slice(0, 2), 16);
    const multicast = Boolean(firstByte & 1);
    const local = Boolean(firstByte & 2);
    output.textContent = [
      formatted,
      `${t("النوع", "Type")}: ${multicast ? t("Multicast", "Multicast") : t("Unicast", "Unicast")}`,
      `${t("الإدارة", "Administration")}: ${local ? t("محلي", "Locally administered") : t("عالمي", "Universally administered")}`
    ].join("\n");
    track(t("تنسيق MAC", "MAC formatter"));
  });

  $("[data-transfer-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const size = Number($("[data-transfer-size]")?.value);
    const sizeUnit = $("[data-transfer-size-unit]")?.value;
    const speed = Number($("[data-transfer-speed]")?.value);
    const speedUnit = $("[data-transfer-speed-unit]")?.value;
    const output = $("[data-transfer-output]");
    if (!output || !Number.isFinite(size) || size <= 0 || !Number.isFinite(speed) || speed <= 0) {
      if (output) output.textContent = t("أدخل قيمًا صحيحة أكبر من صفر.", "Enter valid values greater than zero.");
      return;
    }
    const sizeBytes = size * ({ MB: 1e6, GB: 1e9, TB: 1e12 }[sizeUnit] || 1);
    const bitsPerSecond = speed * ({ Mbps: 1e6, Gbps: 1e9 }[speedUnit] || 1);
    const seconds = (sizeBytes * 8) / bitsPerSecond;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);
    output.textContent = `${t("المدة التقديرية", "Estimated time")}: ${hours}h ${minutes}m ${secs}s\n${t("ملاحظة: النتيجة النظرية ولا تشمل الحمل الإضافي أو تقلب السرعة.", "Note: theoretical result; protocol overhead and speed fluctuation are not included.")}`;
    track(t("حاسبة نقل الملفات", "Transfer time calculator"));
  });

  // Encoders and decoders.
  const utf8ToBase64 = (value) => {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
  };
  const base64ToUtf8 = (value) => new TextDecoder().decode(Uint8Array.from(atob(value), (character) => character.charCodeAt(0)));
  const htmlEncode = (value) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
  const htmlDecode = (value) => new DOMParser().parseFromString(`<body>${value}</body>`, "text/html").body.textContent || "";

  $$('[data-transform]').forEach((button) => {
    button.addEventListener("click", () => {
      const module = button.closest("[data-tool-module]");
      const input = $("[data-transform-input]", module);
      const output = $("[data-transform-output]", module);
      if (!input || !output) return;
      try {
        const action = button.dataset.transform;
        const functions = {
          "base64-encode": utf8ToBase64,
          "base64-decode": base64ToUtf8,
          "url-encode": encodeURIComponent,
          "url-decode": decodeURIComponent,
          "html-encode": htmlEncode,
          "html-decode": htmlDecode
        };
        output.value = functions[action](input.value);
        track(button.dataset.toolName || action);
      } catch (_) {
        output.value = t("تعذر تنفيذ العملية. تحقق من الإدخال.", "Unable to process the input.");
      }
    });
  });

  const digestHex = async (algorithm, value) => {
    const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(value));
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  };

  $("[data-hash-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = $("[data-hash-input]");
    const algorithm = $("[data-hash-algorithm]");
    const output = $("[data-hash-output]");
    if (!input || !algorithm || !output) return;
    output.value = t("جارٍ الحساب...", "Calculating...");
    try {
      output.value = await digestHex(algorithm.value, input.value);
      track(t("مولد Hash", "Hash generator"));
    } catch (_) {
      output.value = t("المتصفح لا يدعم الخوارزمية المطلوبة.", "This browser does not support the selected algorithm.");
    }
  });

  const decodeBase64Url = (value) => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    return base64ToUtf8(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
  };

  $("[data-jwt-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-jwt-input]");
    const output = $("[data-jwt-output]");
    if (!input || !output) return;
    try {
      const parts = input.value.trim().split(".");
      if (parts.length < 2) throw new Error("invalid");
      const decoded = {
        header: JSON.parse(decodeBase64Url(parts[0])),
        payload: JSON.parse(decodeBase64Url(parts[1])),
        warning: t("تم فك الترميز فقط ولم يتم التحقق من التوقيع.", "Decoded only; the signature was not verified.")
      };
      output.textContent = JSON.stringify(decoded, null, 2);
      track(t("فك JWT", "JWT decoder"));
    } catch (_) {
      output.textContent = t("JWT غير صحيح أو غير قابل للفك.", "Invalid or undecodable JWT.");
    }
  });

  $("[data-uuid-generate]")?.addEventListener("click", () => {
    const output = $("[data-uuid-output]");
    if (!output) return;
    output.value = crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
      const random = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
      return (character === "x" ? random : (random & 3) | 8).toString(16);
    });
    track(t("مولد UUID", "UUID generator"));
  });

  const randomFrom = (characters) => characters[crypto.getRandomValues(new Uint32Array(1))[0] % characters.length];
  $("[data-password-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const length = Math.min(128, Math.max(8, Number($("[data-password-length]")?.value || 20)));
    const groups = [];
    if ($("[data-password-lower]")?.checked) groups.push("abcdefghijklmnopqrstuvwxyz");
    if ($("[data-password-upper]")?.checked) groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if ($("[data-password-number]")?.checked) groups.push("0123456789");
    if ($("[data-password-symbol]")?.checked) groups.push("!@#$%^&*()-_=+[]{};:,.?");
    const output = $("[data-password-output]");
    if (!output) return;
    if (!groups.length) {
      output.value = t("اختر نوعًا واحدًا على الأقل من المحارف.", "Select at least one character group.");
      return;
    }
    const all = groups.join("");
    const result = groups.map(randomFrom);
    while (result.length < length) result.push(randomFrom(all));
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (index + 1);
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    output.value = result.join("");
    track(t("مولد كلمات المرور", "Password generator"));
  });

  const scorePassword = (value) => {
    let score = 0;
    if (value.length >= 8) score += 1;
    if (value.length >= 12) score += 1;
    if (value.length >= 16) score += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    if (/(.)\1{2,}|1234|qwerty|password|admin/i.test(value)) score -= 2;
    return Math.max(0, Math.min(6, score));
  };

  $("[data-strength-input]")?.addEventListener("input", (event) => {
    const value = event.target.value;
    const output = $("[data-strength-output]");
    const meter = $("[data-strength-meter]");
    if (!output || !meter) return;
    const score = scorePassword(value);
    const labelsAr = ["ضعيفة جدًا", "ضعيفة", "مقبولة", "جيدة", "قوية", "قوية جدًا", "ممتازة"];
    const labelsEn = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong", "Excellent"];
    output.textContent = value ? (language === "ar" ? labelsAr[score] : labelsEn[score]) : "—";
    meter.value = score;
  });

  $("[data-timestamp-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-timestamp-input]");
    const mode = $("[data-timestamp-mode]");
    const output = $("[data-timestamp-output]");
    if (!input || !mode || !output) return;
    try {
      if (mode.value === "unix") {
        let timestamp = Number(input.value.trim());
        if (String(Math.trunc(timestamp)).length <= 10) timestamp *= 1000;
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) throw new Error("invalid");
        output.textContent = `${date.toISOString()}\n${date.toLocaleString(language === "ar" ? "ar-SA" : "en-US", { timeZone: "Asia/Riyadh" })}`;
      } else {
        const date = new Date(input.value.trim());
        if (Number.isNaN(date.getTime())) throw new Error("invalid");
        output.textContent = `${Math.floor(date.getTime() / 1000)}\n${date.toISOString()}`;
      }
      track(t("محول الوقت", "Timestamp converter"));
    } catch (_) {
      output.textContent = t("قيمة الوقت غير صحيحة.", "Invalid timestamp or date.");
    }
  });

  $("[data-diff-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const left = $("[data-diff-left]")?.value.split(/\r?\n/) || [];
    const right = $("[data-diff-right]")?.value.split(/\r?\n/) || [];
    const output = $("[data-diff-output]");
    if (!output) return;
    const max = Math.max(left.length, right.length);
    const result = [];
    for (let index = 0; index < max; index += 1) {
      if (left[index] === right[index]) result.push(`  ${left[index] ?? ""}`);
      else {
        if (left[index] !== undefined) result.push(`- ${left[index]}`);
        if (right[index] !== undefined) result.push(`+ ${right[index]}`);
      }
    }
    output.textContent = result.join("\n") || t("لا يوجد محتوى للمقارنة.", "Nothing to compare.");
    track(t("مقارنة النصوص", "Text diff"));
  });

  $("[data-ioc-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-ioc-input]")?.value || "";
    const output = $("[data-ioc-output]");
    if (!output) return;
    const unique = (matches) => [...new Set(matches || [])];
    const ipv4 = unique(input.match(/\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/g));
    const urls = unique(input.match(/https?:\/\/[^\s"'<>]+/gi));
    const emails = unique(input.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi));
    const hashes = unique(input.match(/\b(?:[a-f0-9]{64}|[a-f0-9]{40}|[a-f0-9]{32})\b/gi));
    const domains = unique(input.match(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}\b/gi))
      .filter((domain) => !emails.some((email) => email.endsWith(`@${domain}`)));
    output.textContent = JSON.stringify({ ipv4, domains, urls, emails, hashes }, null, 2);
    track(t("استخراج مؤشرات الاختراق", "IOC extractor"));
  });


  const commonPorts = Object.freeze({
    20: ["FTP data", "TCP"], 21: ["FTP control", "TCP"], 22: ["SSH / SFTP", "TCP"],
    23: ["Telnet", "TCP"], 25: ["SMTP", "TCP"], 53: ["DNS", "TCP/UDP"], 67: ["DHCP server", "UDP"],
    68: ["DHCP client", "UDP"], 69: ["TFTP", "UDP"], 80: ["HTTP", "TCP"], 88: ["Kerberos", "TCP/UDP"],
    110: ["POP3", "TCP"], 123: ["NTP", "UDP"], 135: ["Microsoft RPC", "TCP/UDP"], 137: ["NetBIOS Name", "UDP"],
    138: ["NetBIOS Datagram", "UDP"], 139: ["NetBIOS Session", "TCP"], 143: ["IMAP", "TCP"], 161: ["SNMP", "UDP"],
    162: ["SNMP Trap", "UDP"], 389: ["LDAP", "TCP/UDP"], 443: ["HTTPS", "TCP"], 445: ["SMB", "TCP"],
    465: ["SMTPS", "TCP"], 500: ["IKE / IPsec", "UDP"], 514: ["Syslog", "UDP"], 587: ["SMTP Submission", "TCP"],
    636: ["LDAPS", "TCP"], 993: ["IMAPS", "TCP"], 995: ["POP3S", "TCP"], 1433: ["Microsoft SQL Server", "TCP"],
    1521: ["Oracle Database", "TCP"], 1812: ["RADIUS Authentication", "UDP"], 1813: ["RADIUS Accounting", "UDP"],
    2049: ["NFS", "TCP/UDP"], 3306: ["MySQL", "TCP"], 3389: ["RDP", "TCP/UDP"], 5432: ["PostgreSQL", "TCP"],
    5900: ["VNC", "TCP"], 6379: ["Redis", "TCP"], 8080: ["Alternate HTTP", "TCP"], 8443: ["Alternate HTTPS", "TCP"]
  });

  $("[data-port-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = String($("[data-port-input]")?.value || "").trim().toLowerCase();
    const output = $("[data-port-output]");
    if (!output) return;
    const exact = Number(query);
    let matches = [];
    if (Number.isInteger(exact) && exact >= 0 && exact <= 65535) {
      const record = commonPorts[exact];
      matches = record ? [[exact, ...record]] : [];
      if (!matches.length) output.textContent = `${exact}: ${t("غير موجود في القائمة المختصرة. قد يكون منفذًا مخصصًا أو ديناميكيًا.", "Not found in the compact list; it may be custom or dynamic.")}`;
    } else {
      matches = Object.entries(commonPorts).filter(([, [service]]) => service.toLowerCase().includes(query)).map(([port, record]) => [port, ...record]);
    }
    if (matches.length) output.textContent = matches.map(([port, service, protocol]) => `${port}/${protocol} — ${service}`).join("\n");
    if (!matches.length && !Number.isInteger(exact)) output.textContent = t("لم يتم العثور على خدمة مطابقة.", "No matching service found.");
    track(t("دليل المنافذ", "Port lookup"));
  });

  $("[data-subnet-split-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = String($("[data-subnet-split-input]")?.value || "").trim();
    const newPrefix = Number($("[data-subnet-split-prefix]")?.value);
    const output = $("[data-subnet-split-output]");
    if (!output) return;
    const [ipText, prefixText] = value.split("/");
    const parts = parseIPv4(ipText);
    const oldPrefix = Number(prefixText);
    if (!parts || !Number.isInteger(oldPrefix) || oldPrefix < 0 || oldPrefix > 32 || !Number.isInteger(newPrefix) || newPrefix <= oldPrefix || newPrefix > 32) {
      output.textContent = t("أدخل شبكة صحيحة واجعل البادئة الجديدة أكبر من الأصلية حتى /32.", "Enter a valid network and choose a new prefix larger than the original, up to /32.");
      return;
    }
    const originalMask = prefixToMask(oldPrefix);
    const network = (ipv4ToInt(parts) & originalMask) >>> 0;
    const subnetSize = 2 ** (32 - newPrefix);
    const subnetCount = 2 ** (newPrefix - oldPrefix);
    const shown = Math.min(subnetCount, 256);
    const rows = [];
    for (let index = 0; index < shown; index += 1) {
      const subnet = network + index * subnetSize;
      const broadcast = subnet + subnetSize - 1;
      rows.push(`${index + 1}. ${intToIPv4(subnet)}/${newPrefix}  ${t("البث", "broadcast")}: ${intToIPv4(broadcast)}`);
    }
    if (subnetCount > shown) rows.push(t(`تم عرض أول ${shown} شبكة من ${subnetCount}.`, `Showing the first ${shown} of ${subnetCount} networks.`));
    output.textContent = rows.join("\n");
    track(t("تقسيم شبكة CIDR", "CIDR subnet splitter"));
  });

  $("[data-text-cleaner-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-text-cleaner-input]");
    const output = $("[data-text-cleaner-output]");
    if (!input || !output) return;
    let cleaned = input.value
      .normalize("NFKC")
      .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .replace(/[ \t]+$/gm, "")
      .replace(/\r\n?/g, "\n");
    if ($("[data-text-cleaner-blank-lines]")?.checked) cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
    output.value = cleaned.trim();
    track(t("منظف النصوص", "Text cleaner"));
  });

  // DNS over HTTPS.
  const dnsLookup = async (name, type) => {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`, {
      headers: { Accept: "application/dns-json" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  };

  $("[data-dns-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = $("[data-dns-name]")?.value.trim();
    const type = $("[data-dns-type]")?.value;
    const output = $("[data-dns-output]");
    if (!name || !type || !output) return;
    output.textContent = t("جارٍ الاستعلام...", "Looking up records...");
    try {
      const result = await dnsLookup(name, type);
      const answers = (result.Answer || []).map((answer) => `${answer.name}  ${answer.TTL}s  ${answer.data}`);
      output.textContent = answers.length
        ? answers.join("\n")
        : `${t("لا توجد سجلات مطابقة.", "No matching records.")}\nStatus: ${result.Status}`;
      track(t("استعلام DNS", "DNS lookup"));
    } catch (error) {
      output.textContent = `${t("تعذر تنفيذ الاستعلام. تحقق من الاتصال أو سياسة المتصفح.", "Lookup failed. Check connectivity or browser policy.")}\n${error.message}`;
    }
  });

  $$('[data-dns-preset]').forEach((button) => {
    button.addEventListener("click", () => {
      const nameInput = $("[data-dns-name]");
      const typeInput = $("[data-dns-type]");
      if (!nameInput || !typeInput) return;
      const base = nameInput.value.trim().replace(/^_dmarc\./i, "");
      if (button.dataset.dnsPreset === "dmarc") {
        nameInput.value = `_dmarc.${base}`;
        typeInput.value = "TXT";
      }
      if (button.dataset.dnsPreset === "spf") typeInput.value = "TXT";
    });
  });

  $("[data-header-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-header-input]")?.value || "";
    const output = $("[data-header-output]");
    if (!output) return;
    const parsed = new Map();
    input.split(/\r?\n/).forEach((line) => {
      const index = line.indexOf(":");
      if (index > 0) parsed.set(line.slice(0, index).trim().toLowerCase(), line.slice(index + 1).trim());
    });
    const checks = [
      ["content-security-policy", "CSP"],
      ["strict-transport-security", "HSTS"],
      ["x-content-type-options", "X-Content-Type-Options"],
      ["referrer-policy", "Referrer-Policy"],
      ["permissions-policy", "Permissions-Policy"],
      ["cross-origin-opener-policy", "COOP"],
      ["cross-origin-resource-policy", "CORP"],
      ["x-frame-options", "X-Frame-Options"]
    ];
    output.textContent = checks.map(([key, label]) => `${parsed.has(key) ? "✓" : "✗"} ${label}${parsed.has(key) ? `: ${parsed.get(key)}` : ""}`).join("\n");
    track(t("تحليل ترويسات الأمان", "Security header analyzer"));
  });

  $("[data-url-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-url-input]")?.value.trim();
    const output = $("[data-url-output]");
    if (!input || !output) return;
    try {
      const url = new URL(input.includes("://") ? input : `https://${input}`);
      output.textContent = [
        `${t("البروتوكول", "Protocol")}: ${url.protocol}`,
        `${t("المضيف", "Host")}: ${url.hostname}`,
        `${t("المنفذ", "Port")}: ${url.port || t("افتراضي", "default")}`,
        `${t("المسار", "Path")}: ${url.pathname}`,
        `${t("الاستعلام", "Query")}: ${url.search || "—"}`,
        `${t("الجزء", "Fragment")}: ${url.hash || "—"}`,
        `${t("HTTPS", "HTTPS")}: ${url.protocol === "https:" ? "✓" : "✗"}`
      ].join("\n");
      track(t("تحليل الرابط", "URL analyzer"));
    } catch (_) {
      output.textContent = t("الرابط غير صحيح.", "Invalid URL.");
    }
  });

  // FortiGate policy builder.
  $("[data-fortigate-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const get = (name) => $((`[name="${name}"]`), event.currentTarget)?.value.trim();
    const checked = (name) => $((`[name="${name}"]`), event.currentTarget)?.checked;
    const policyName = get("policyName") || "LAN-to-Internet";
    const services = (get("services") || "ALL").split(/[,\s]+/).filter(Boolean).map((service) => `"${service}"`).join(" ");
    const output = $("[data-fortigate-output]");
    if (!output) return;
    output.textContent = [
      "config firewall policy",
      "    edit 0",
      `        set name "${policyName.replace(/"/g, "")}"`,
      `        set srcintf "${get("srcintf") || "internal"}"`,
      `        set dstintf "${get("dstintf") || "wan1"}"`,
      `        set srcaddr "${get("srcaddr") || "all"}"`,
      `        set dstaddr "${get("dstaddr") || "all"}"`,
      `        set action ${get("action") || "accept"}`,
      "        set schedule \"always\"",
      `        set service ${services}`,
      `        set nat ${checked("nat") ? "enable" : "disable"}`,
      `        set logtraffic ${checked("logging") ? "all" : "utm"}`,
      "    next",
      "end"
    ].join("\n");
    track(t("منشئ سياسة FortiGate", "FortiGate policy builder"));
  });

  // Cisco configuration builder.
  const ciscoTemplates = {
    vlan: (values) => `vlan ${values.id || "10"}\n name ${(values.name || "USERS").replace(/\s+/g, "_")}\nexit`,
    access: (values) => `interface ${values.interface || "GigabitEthernet1/0/1"}\n description ${values.description || "ACCESS_PORT"}\n switchport mode access\n switchport access vlan ${values.id || "10"}\n spanning-tree portfast\n spanning-tree bpduguard enable\n no shutdown`,
    trunk: (values) => `interface ${values.interface || "GigabitEthernet1/0/48"}\n description ${values.description || "TRUNK"}\n switchport mode trunk\n switchport trunk allowed vlan ${values.vlans || "10,20,30"}\n no shutdown`,
    ospf: (values) => `router ospf ${values.process || "1"}\n router-id ${values.routerId || "1.1.1.1"}\n network ${values.network || "192.168.10.0"} ${values.wildcard || "0.0.0.255"} area ${values.area || "0"}\n passive-interface default\n no passive-interface ${values.interface || "GigabitEthernet0/0"}`,
    hsrp: (values) => `interface ${values.interface || "Vlan10"}\n standby ${values.group || "10"} ip ${values.virtualIp || "192.168.10.1"}\n standby ${values.group || "10"} priority ${values.priority || "110"}\n standby ${values.group || "10"} preempt`,
    dhcp: (values) => `ip dhcp excluded-address ${values.excludedStart || "192.168.10.1"} ${values.excludedEnd || "192.168.10.20"}\nip dhcp pool ${values.name || "VLAN10"}\n network ${values.network || "192.168.10.0"} ${values.mask || "255.255.255.0"}\n default-router ${values.gateway || "192.168.10.1"}\n dns-server ${values.dns || "1.1.1.1 1.0.0.1"}`,
    acl: (values) => `ip access-list extended ${values.name || "LIMIT_USERS"}\n permit tcp ${values.source || "192.168.10.0 0.0.0.255"} ${values.destination || "any"} eq ${values.port || "443"}\n deny ip any any log`,
    etherchannel: (values) => `interface range ${values.range || "GigabitEthernet1/0/1-2"}\n channel-group ${values.group || "1"} mode ${values.mode || "active"}\n no shutdown\ninterface Port-channel${values.group || "1"}\n switchport mode trunk`,
    ssh: (values) => `hostname ${values.hostname || "SW-01"}\nip domain-name ${values.domain || "lab.local"}\nusername ${values.username || "admin"} privilege 15 secret <STRONG_SECRET>\ncrypto key generate rsa modulus 2048\nip ssh version 2\nline vty 0 15\n login local\n transport input ssh\n exec-timeout 10 0`
  };

  $("[data-cisco-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const output = $("[data-cisco-output]");
    const template = ciscoTemplates[values.scenario];
    if (!output || !template) return;
    output.textContent = template(values);
    track(t("منشئ إعداد Cisco", "Cisco configuration builder"));
  });

  // Log analyzer.
  $("[data-log-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("[data-log-input]")?.value || "";
    const output = $("[data-log-output]");
    if (!output) return;
    const lines = input.split(/\r?\n/).filter((line) => line.trim());
    const counters = { critical: 0, error: 0, warning: 0, info: 0, auth: 0 };
    const ips = new Map();
    const suspicious = [];
    lines.forEach((line, index) => {
      const lower = line.toLowerCase();
      if (/critical|fatal|panic|emergency|alert/.test(lower)) counters.critical += 1;
      else if (/error|failed|failure|denied|blocked|drop/.test(lower)) counters.error += 1;
      else if (/warn|timeout|retry|degraded/.test(lower)) counters.warning += 1;
      else counters.info += 1;
      if (/login|authentication|ssh|sudo|password/.test(lower)) counters.auth += 1;
      const matches = line.match(/\b(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}\b/g) || [];
      matches.forEach((ip) => ips.set(ip, (ips.get(ip) || 0) + 1));
      if (/failed password|brute|sql injection|xss|malware|ransom|denied|blocked|critical|fatal/i.test(line)) {
        suspicious.push(`${index + 1}: ${line}`);
      }
    });
    const topIps = [...ips.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    output.textContent = [
      `${t("الأسطر", "Lines")}: ${lines.length}`,
      `${t("حرج", "Critical")}: ${counters.critical}`,
      `${t("أخطاء", "Errors")}: ${counters.error}`,
      `${t("تحذيرات", "Warnings")}: ${counters.warning}`,
      `${t("أحداث مصادقة", "Authentication events")}: ${counters.auth}`,
      "",
      t("أكثر عناوين IP تكرارًا:", "Top IP addresses:"),
      ...(topIps.length ? topIps.map(([ip, count]) => `${ip}: ${count}`) : [t("لا يوجد", "None")]),
      "",
      t("أسطر تستحق المراجعة:", "Lines worth reviewing:"),
      ...(suspicious.length ? suspicious.slice(0, 50) : [t("لم تُكتشف أنماط واضحة.", "No obvious patterns detected.")])
    ].join("\n");
    track(t("محلل السجلات", "Log analyzer"));
  });

  // Command builder.
  const commandTemplates = {
    linux_find: (v) => `find ${v.path || "/var/log"} -type f -name "${v.pattern || "*.log"}"${v.extra ? ` ${v.extra}` : ""}`,
    linux_port: (v) => `ss -tulpn${v.port ? ` | grep ':${v.port}'` : ""}`,
    powershell_process: (v) => `Get-Process${v.pattern ? ` | Where-Object { $_.ProcessName -like "*${v.pattern}*" }` : ""}`,
    powershell_port: (v) => `Get-NetTCPConnection${v.port ? ` -LocalPort ${v.port}` : ""} | Sort-Object State`,
    docker_logs: (v) => `docker logs ${v.container || "container_name"} --tail ${v.lines || "100"} -f`,
    docker_exec: (v) => `docker exec -it ${v.container || "container_name"} ${v.shell || "/bin/sh"}`,
    git_branch: (v) => `git switch -c ${v.branch || "feature/name"}`,
    git_log: () => "git log --oneline --graph --decorate --all",
    nmap_service: (v) => `nmap -sV -T3 --top-ports ${v.ports || "100"} ${v.target || "192.168.1.10"}`,
    nmap_safe: (v) => `nmap -sV --script safe ${v.target || "192.168.1.10"}`,
    fortigate_route: () => "get router info routing-table all",
    fortigate_session: (v) => `diagnose sys session filter ${v.filter || "src 192.168.1.10"}\ndiagnose sys session list`,
    cisco_interface: () => "show interfaces status\nshow interfaces counters errors",
    cisco_route: () => "show ip route\nshow ip ospf neighbor"
  };

  $("[data-command-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const output = $("[data-command-output]");
    const template = commandTemplates[values.recipe];
    if (!output || !template) return;
    output.textContent = template(values);
    track(t("منشئ الأوامر", "Command builder"));
  });

  // Site search.
  const searchIndex = Array.isArray(window.KHALID_SEARCH_INDEX) ? window.KHALID_SEARCH_INDEX : [];
  const renderSearchResults = (query) => {
    const list = $("[data-site-search-results]");
    if (!list) return;
    list.replaceChildren();
    const normalizedQuery = normalize(query);
    if (normalizedQuery.length < 2) {
      const item = document.createElement("li");
      item.textContent = t("اكتب حرفين على الأقل للبحث.", "Enter at least two characters.");
      list.append(item);
      return;
    }
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    const results = searchIndex.map((entry) => {
      const haystack = normalize(`${entry.title} ${entry.description} ${entry.keywords || ""}`);
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { entry, score };
    }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 20);

    if (!results.length) {
      const item = document.createElement("li");
      item.textContent = t("لم يتم العثور على نتائج.", "No results found.");
      list.append(item);
      return;
    }
    results.forEach(({ entry }) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const title = document.createElement("strong");
      const description = document.createElement("span");
      link.href = language === "ar" ? (entry.arUrl || entry.url) : (entry.enUrl || entry.url);
      title.textContent = language === "ar" ? (entry.arTitle || entry.title) : (entry.enTitle || entry.title);
      description.textContent = language === "ar" ? (entry.arDescription || entry.description) : (entry.enDescription || entry.description);
      link.append(title, description);
      item.append(link);
      list.append(item);
    });
    track(t("البحث الشامل", "Site search"));
  };

  $("[data-site-search-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    renderSearchResults($("[data-site-search-input]")?.value || "");
  });
  $("[data-site-search-input]")?.addEventListener("input", (event) => {
    if (event.target.value.length >= 2) renderSearchResults(event.target.value);
  });

  // Quiz.
  const questions = [
    { category: "CCNA", ar: "أي طبقة من OSI تستخدم عنوان MAC؟", en: "Which OSI layer uses MAC addresses?", optionsAr: ["الفيزيائية", "ربط البيانات", "الشبكة", "النقل"], optionsEn: ["Physical", "Data Link", "Network", "Transport"], answer: 1, explainAr: "عنوان MAC يعمل في طبقة ربط البيانات Layer 2.", explainEn: "MAC addressing operates at the Data Link layer, Layer 2." },
    { category: "CCNA", ar: "ما القناع الموافق لـ /27؟", en: "Which subnet mask matches /27?", optionsAr: ["255.255.255.0", "255.255.255.192", "255.255.255.224", "255.255.255.240"], optionsEn: ["255.255.255.0", "255.255.255.192", "255.255.255.224", "255.255.255.240"], answer: 2, explainAr: "/27 يترك 5 بتات للمضيفين وقناعه 255.255.255.224.", explainEn: "/27 leaves five host bits and maps to 255.255.255.224." },
    { category: "FortiGate", ar: "ما وظيفة policy route في FortiGate؟", en: "What does a FortiGate policy route do?", optionsAr: ["تشفير الإدارة", "اختيار مسار بناءً على معايير إضافية", "إنشاء مستخدم", "تحديث FortiOS"], optionsEn: ["Encrypt management", "Choose a path using additional criteria", "Create a user", "Update FortiOS"], answer: 1, explainAr: "تسمح policy route بتوجيه الحركة وفق المصدر أو الوجهة أو الخدمة وغيرها.", explainEn: "A policy route can steer traffic using source, destination, service, and other criteria." },
    { category: "FortiGate", ar: "أي أمر يعرض جدول التوجيه؟", en: "Which command displays the routing table?", optionsAr: ["get router info routing-table all", "show firewall policy", "diagnose debug reset", "get system status"], optionsEn: ["get router info routing-table all", "show firewall policy", "diagnose debug reset", "get system status"], answer: 0, explainAr: "الأمر get router info routing-table all يعرض المسارات المعروفة.", explainEn: "get router info routing-table all displays known routes." },
    { category: "Security+", ar: "ما الهدف الأساسي من مبدأ أقل صلاحية؟", en: "What is the main goal of least privilege?", optionsAr: ["رفع الأداء", "تقليل الصلاحيات إلى الحد الضروري", "إلغاء التسجيل", "زيادة عدد الحسابات"], optionsEn: ["Increase performance", "Limit permissions to what is necessary", "Disable logging", "Increase account count"], answer: 1, explainAr: "يقلل أقل صلاحية أثر اختراق الحساب أو الخطأ البشري.", explainEn: "Least privilege limits the impact of compromise and human error." },
    { category: "SOC", ar: "ما أول خطوة عند ملاحظة تنبيه مشبوه؟", en: "What is the first step after noticing a suspicious alert?", optionsAr: ["حذف السجلات", "التحقق وجمع السياق", "إعادة تشغيل كل الخوادم", "إغلاق SIEM"], optionsEn: ["Delete logs", "Validate and gather context", "Restart every server", "Shut down the SIEM"], answer: 1, explainAr: "يجب التحقق من صحة التنبيه وجمع الأدلة والسياق قبل اتخاذ إجراء مؤثر.", explainEn: "Validate the alert and collect evidence and context before disruptive action." },
    { category: "Linux", ar: "أي أمر يعرض المنافذ المستمعة والعمليات؟", en: "Which command shows listening ports and processes?", optionsAr: ["ls -la", "ss -tulpn", "pwd", "whoami"], optionsEn: ["ls -la", "ss -tulpn", "pwd", "whoami"], answer: 1, explainAr: "ss -tulpn يعرض TCP/UDP والمنافذ والعمليات عند توفر الصلاحية.", explainEn: "ss -tulpn shows TCP/UDP listeners, ports, and processes when permitted." },
    { category: "Home Lab", ar: "ما فائدة Pi-hole داخل الشبكة؟", en: "What is Pi-hole used for in a network?", optionsAr: ["موازنة الأحمال", "حجب نطاقات الإعلانات عبر DNS", "تشغيل BGP", "تشفير الأقراص"], optionsEn: ["Load balancing", "DNS-based blocking of advertising domains", "Run BGP", "Disk encryption"], answer: 1, explainAr: "Pi-hole يعمل كخادم DNS يحجب النطاقات الموجودة في قوائم الحظر.", explainEn: "Pi-hole acts as a DNS server that blocks domains found in blocklists." },
    { category: "CCNA", ar: "ما بروتوكول منع الحلقات في شبكات Layer 2؟", en: "Which protocol prevents Layer 2 loops?", optionsAr: ["OSPF", "STP", "NAT", "DHCP"], optionsEn: ["OSPF", "STP", "NAT", "DHCP"], answer: 1, explainAr: "Spanning Tree Protocol يمنع الحلقات عبر حجب المسارات الزائدة منطقيًا.", explainEn: "Spanning Tree Protocol blocks redundant paths logically to prevent loops." },
    { category: "Security+", ar: "أي قيمة Hash تعتبر أقوى للاستخدام العام: MD5 أم SHA-256؟", en: "Which hash is generally stronger: MD5 or SHA-256?", optionsAr: ["MD5", "SHA-256", "متساويان", "لا يوجد فرق"], optionsEn: ["MD5", "SHA-256", "They are equal", "No difference"], answer: 1, explainAr: "MD5 لديه تصادمات معروفة ولا يناسب التطبيقات الأمنية الحديثة.", explainEn: "MD5 has known collision weaknesses and is unsuitable for modern security uses." },
    { category: "SOC", ar: "ما معنى IOC؟", en: "What does IOC mean?", optionsAr: ["مؤشر اختراق", "قاعدة توجيه", "نوع تشفير", "واجهة شبكة"], optionsEn: ["Indicator of Compromise", "Routing rule", "Encryption type", "Network interface"], answer: 0, explainAr: "IOC هو أثر أو دليل قد يشير إلى نشاط ضار مثل IP أو Hash أو Domain.", explainEn: "An IOC is an artifact that may indicate malicious activity, such as an IP, hash, or domain." },
    { category: "FortiGate", ar: "أي خيار يسجل الجلسات المقبولة والمرفوضة حسب السياسة؟", en: "Which setting controls traffic logging on a FortiGate policy?", optionsAr: ["set logtraffic", "set hostname", "set alias", "set timezone"], optionsEn: ["set logtraffic", "set hostname", "set alias", "set timezone"], answer: 0, explainAr: "set logtraffic يحدد مستوى تسجيل الحركة في السياسة.", explainEn: "set logtraffic controls traffic logging for the policy." }
  ];

  let currentQuestion = null;
  const quizContainer = $("[data-quiz-container]");
  const quizDateSeed = () => Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
  const chooseQuestion = (random = false) => questions[random ? Math.floor(Math.random() * questions.length) : quizDateSeed() % questions.length];
  const renderQuestion = (question) => {
    if (!quizContainer) return;
    currentQuestion = question;
    quizContainer.replaceChildren();
    const meta = document.createElement("div");
    meta.className = "quiz-meta";
    meta.textContent = question.category;
    const heading = document.createElement("h3");
    heading.textContent = language === "ar" ? question.ar : question.en;
    const options = document.createElement("div");
    options.className = "quiz-options";
    (language === "ar" ? question.optionsAr : question.optionsEn).forEach((label, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = label;
      button.addEventListener("click", () => {
        $$(".quiz-option", options).forEach((item, optionIndex) => {
          item.disabled = true;
          if (optionIndex === question.answer) item.classList.add("correct");
          if (item === button && optionIndex !== question.answer) item.classList.add("wrong");
        });
        const explanation = document.createElement("p");
        explanation.className = "quiz-explanation";
        explanation.textContent = language === "ar" ? question.explainAr : question.explainEn;
        quizContainer.append(explanation);
        track(t("الاختبار اليومي", "Daily quiz"));
      });
      options.append(button);
    });
    quizContainer.append(meta, heading, options);
  };
  if (quizContainer) renderQuestion(chooseQuestion(false));
  $("[data-random-question]")?.addEventListener("click", () => renderQuestion(chooseQuestion(true)));

  // Feedback/report composer.
  $("[data-feedback-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const output = $("[data-feedback-output]");
    if (!output) return;
    const subject = `[alaaamri.com] ${values.type || "Feedback"}`;
    const body = [
      `${t("النوع", "Type")}: ${values.type || "—"}`,
      `${t("الصفحة", "Page")}: ${values.page || location.href}`,
      `${t("الاسم", "Name")}: ${values.name || t("غير محدد", "Not provided")}`,
      "",
      values.message || ""
    ].join("\n");
    output.value = body;
    const mailLink = $("[data-feedback-mail]");
    if (mailLink) mailLink.href = `mailto:k@alaaamri.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    track(t("نظام البلاغات", "Feedback system"));
  });

  $("[data-reset-usage]")?.addEventListener("click", () => {
    try { localStorage.removeItem("khalidToolUsage"); } catch (_) {}
    renderUsage();
    toast(t("تم تصفير الإحصائيات المحلية", "Local usage statistics cleared"));
  });

  renderUsage();
})();
