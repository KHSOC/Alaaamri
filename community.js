"use strict";

(() => {
  const language = document.documentElement.lang === "ar" ? "ar" : "en";
  const t = (ar, en) => language === "ar" ? ar : en;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const config = window.KHALID_SITE_CONFIG || {};
  const configured = Boolean(
    config.communityEnabled
    && /^https:\/\/[^/]+\.supabase\.co$/i.test(String(config.supabaseUrl || "").replace(/\/$/, ""))
    && String(config.supabaseAnonKey || "").length > 20
  );
  const baseUrl = String(config.supabaseUrl || "").replace(/\/$/, "");
  const anonKey = String(config.supabaseAnonKey || "");
  const sessionKey = "khalidCommunitySession";
  const displayNameKey = "khalidCommunityDisplayName";
  let session = null;
  let chatTimer = 0;
  let commentTimers = [];

  const setStatus = (message, kind = "info") => {
    $$('[data-community-status]').forEach((element) => {
      element.textContent = message;
      element.dataset.kind = kind;
    });
  };

  const setAuthMessage = (message, kind = "info") => {
    const element = $("[data-auth-message]");
    if (!element) return;
    element.textContent = message;
    element.dataset.kind = kind;
  };

  const readSession = () => {
    try {
      return JSON.parse(localStorage.getItem(sessionKey) || "null");
    } catch (_) {
      return null;
    }
  };

  const storeSession = (value) => {
    session = value;
    try {
      if (value) localStorage.setItem(sessionKey, JSON.stringify(value));
      else localStorage.removeItem(sessionKey);
    } catch (_) {}
    updateAuthUi();
  };

  const getDisplayName = () => {
    const metadataName = session?.user?.user_metadata?.display_name;
    if (metadataName) return String(metadataName).slice(0, 40);
    try {
      const stored = localStorage.getItem(displayNameKey);
      if (stored) return stored.slice(0, 40);
    } catch (_) {}
    const email = session?.user?.email || "visitor";
    return email.split("@")[0].slice(0, 40);
  };

  const api = async (path, options = {}, requireAuth = false) => {
    if (!configured) throw new Error("community-not-configured");
    const token = session?.access_token;
    if (requireAuth && !token) throw new Error("authentication-required");
    const headers = new Headers(options.headers || {});
    headers.set("apikey", anonKey);
    headers.set("Authorization", `Bearer ${token || anonKey}`);
    if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
    if (!response.ok) {
      let detail = "";
      try {
        const payload = await response.json();
        detail = payload.msg || payload.message || payload.error_description || payload.hint || "";
      } catch (_) {}
      throw new Error(detail || `HTTP ${response.status}`);
    }
    if (response.status === 204) return null;
    const contentType = response.headers.get("content-type") || "";
    return contentType.includes("application/json") ? response.json() : response.text();
  };

  const validateStoredSession = async () => {
    session = readSession();
    if (!configured || !session?.access_token) {
      updateAuthUi();
      return;
    }
    try {
      const user = await api("/auth/v1/user", {}, true);
      session.user = user;
      storeSession(session);
    } catch (_) {
      storeSession(null);
    }
  };

  const updateAuthUi = () => {
    const signedIn = Boolean(session?.access_token && session?.user);
    $$('[data-auth-required]').forEach((element) => { element.hidden = !signedIn; });
    $$('[data-auth-guest]').forEach((element) => { element.hidden = signedIn; });
    $$('[data-auth-email]').forEach((element) => {
      element.textContent = signedIn ? (session.user.email || getDisplayName()) : t("غير مسجل", "Signed out");
    });
    $$('button[data-requires-auth], input[data-requires-auth], textarea[data-requires-auth]').forEach((element) => {
      element.disabled = !signedIn || !configured;
    });
  };

  const renderMessages = (container, rows, emptyText) => {
    container.replaceChildren();
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.className = "community-empty";
      empty.textContent = emptyText;
      container.append(empty);
      return;
    }
    rows.forEach((row) => {
      const article = document.createElement("article");
      article.className = "community-message";
      const head = document.createElement("div");
      head.className = "community-message-head";
      const name = document.createElement("strong");
      const time = document.createElement("time");
      const body = document.createElement("p");
      name.textContent = row.user_name || t("زائر", "Visitor");
      const date = new Date(row.created_at);
      time.dateTime = Number.isNaN(date.getTime()) ? "" : date.toISOString();
      time.textContent = Number.isNaN(date.getTime()) ? "" : date.toLocaleString(language === "ar" ? "ar-SA" : "en-US", { dateStyle: "medium", timeStyle: "short" });
      body.textContent = row.message || row.comment || "";
      head.append(name, time);
      article.append(head, body);
      container.append(article);
    });
  };

  const loadChat = async () => {
    const container = $("[data-chat-messages]");
    if (!container || !configured) return;
    try {
      const room = encodeURIComponent(config.chatRoom || "tech-lounge");
      const rows = await api(`/rest/v1/chat_messages?select=id,user_name,message,created_at&room=eq.${room}&order=created_at.asc&limit=100`);
      renderMessages(container, Array.isArray(rows) ? rows : [], t("لا توجد رسائل بعد. ابدأ النقاش.", "No messages yet. Start the conversation."));
      container.scrollTop = container.scrollHeight;
    } catch (error) {
      container.textContent = `${t("تعذر تحميل الرسائل", "Could not load messages")}: ${error.message}`;
    }
  };

  const loadComments = async (widget) => {
    if (!configured) return;
    const pageSlug = widget.dataset.pageSlug;
    const container = $("[data-comment-list]", widget);
    if (!pageSlug || !container) return;
    try {
      const rows = await api(`/rest/v1/page_comments?select=id,user_name,comment,created_at&page_slug=eq.${encodeURIComponent(pageSlug)}&order=created_at.asc&limit=100`);
      renderMessages(container, Array.isArray(rows) ? rows : [], t("لا توجد تعليقات بعد.", "No comments yet."));
    } catch (error) {
      container.textContent = `${t("تعذر تحميل التعليقات", "Could not load comments")}: ${error.message}`;
    }
  };

  const initAuthForms = () => {
    $("[data-signup-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!configured) return;
      const values = Object.fromEntries(new FormData(event.currentTarget).entries());
      if (!values.email || String(values.password || "").length < 8) {
        setAuthMessage(t("أدخل بريدًا صحيحًا وكلمة مرور من 8 أحرف على الأقل.", "Enter a valid email and a password of at least eight characters."), "error");
        return;
      }
      try {
        const payload = await api("/auth/v1/signup", {
          method: "POST",
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            data: { display_name: String(values.displayName || "").slice(0, 40) }
          })
        });
        if (payload?.access_token) storeSession(payload);
        setAuthMessage(t("تم إنشاء الحساب. قد تحتاج لتأكيد البريد قبل تسجيل الدخول.", "Account created. Email confirmation may be required before sign-in."), "success");
      } catch (error) {
        setAuthMessage(error.message, "error");
      }
    });

    $("[data-signin-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!configured) return;
      const values = Object.fromEntries(new FormData(event.currentTarget).entries());
      try {
        const payload = await api("/auth/v1/token?grant_type=password", {
          method: "POST",
          body: JSON.stringify({ email: values.email, password: values.password })
        });
        storeSession(payload);
        setAuthMessage(t("تم تسجيل الدخول.", "Signed in."), "success");
        loadChat();
        $$('[data-comments-widget]').forEach(loadComments);
        syncFavorites();
      } catch (error) {
        setAuthMessage(error.message, "error");
      }
    });

    $("[data-signout]")?.addEventListener("click", async () => {
      try {
        if (configured && session?.access_token) await api("/auth/v1/logout", { method: "POST" }, true);
      } catch (_) {}
      storeSession(null);
      setAuthMessage(t("تم تسجيل الخروج.", "Signed out."), "success");
    });
  };

  const initChat = () => {
    const form = $("[data-chat-form]");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const field = $("[name=message]", form);
      const message = field?.value.trim() || "";
      if (!configured || !session?.user || !message) return;
      if (message.length > 300) {
        setStatus(t("الرسالة يجب ألا تتجاوز 300 حرف.", "Messages are limited to 300 characters."), "error");
        return;
      }
      try {
        await api("/rest/v1/chat_messages", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            room: config.chatRoom || "tech-lounge",
            user_id: session.user.id,
            user_name: getDisplayName(),
            message
          })
        }, true);
        field.value = "";
        await loadChat();
      } catch (error) {
        setStatus(error.message, "error");
      }
    });
  };

  const initComments = () => {
    $$('[data-comments-widget]').forEach((widget) => {
      const form = $("[data-comment-form]", widget);
      if (!configured) {
        widget.dataset.state = "disabled";
        const note = $("[data-comment-note]", widget);
        if (note) note.textContent = t("التعليقات جاهزة لكنها غير مرتبطة بقاعدة البيانات بعد.", "Comments are ready but not connected to the database yet.");
        return;
      }
      loadComments(widget);
      const timer = window.setInterval(() => loadComments(widget), Number(config.pollIntervalMs || 5000));
      commentTimers.push(timer);
      form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const field = $("[name=comment]", form);
        const comment = field?.value.trim() || "";
        if (!session?.user || !comment || comment.length > 500) return;
        try {
          await api("/rest/v1/page_comments", {
            method: "POST",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({
              page_slug: widget.dataset.pageSlug,
              user_id: session.user.id,
              user_name: getDisplayName(),
              comment
            })
          }, true);
          field.value = "";
          await loadComments(widget);
        } catch (error) {
          const note = $("[data-comment-note]", widget);
          if (note) note.textContent = error.message;
        }
      });
    });
  };

  const localFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem("khalidPageFavorites") || "[]");
    } catch (_) {
      return [];
    }
  };

  const renderFavorites = (rows = null) => {
    const list = $("[data-favorites-list]");
    if (!list) return;
    const values = rows || localFavorites();
    list.replaceChildren();
    if (!values.length) {
      const item = document.createElement("li");
      item.textContent = t("لم تحفظ أي صفحة بعد. استخدم زر النجمة داخل الموقع.", "No pages saved yet. Use the star button across the site.");
      list.append(item);
      return;
    }
    values.forEach((favorite) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = favorite.url || favorite.item_url || "/";
      link.textContent = favorite.title || favorite.item_title || favorite.url || favorite.item_url;
      item.append(link);
      list.append(item);
    });
  };

  const syncFavorites = async () => {
    renderFavorites();
    if (!configured || !session?.user) return;
    try {
      const locals = localFavorites();
      for (const favorite of locals) {
        await api("/rest/v1/user_favorites?on_conflict=user_id,item_url", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({
            user_id: session.user.id,
            item_url: favorite.url,
            item_title: favorite.title
          })
        }, true);
      }
      const remote = await api(`/rest/v1/user_favorites?select=id,item_url,item_title,created_at&user_id=eq.${session.user.id}&order=created_at.desc`, {}, true);
      if (Array.isArray(remote)) renderFavorites(remote);
    } catch (_) {
      renderFavorites();
    }
  };

  const initCommunity = async () => {
    if (!configured) {
      setStatus(t("الواجهة جاهزة، لكن الحسابات والدردشة والتعليقات تحتاج إدخال بيانات Supabase في site-config.js ثم تشغيل ملف community-database.sql.", "The interface is ready, but accounts, chat, and comments require Supabase values in site-config.js and the community-database.sql setup."), "setup");
      $$('[data-signup-form] input, [data-signup-form] button, [data-signin-form] input, [data-signin-form] button').forEach((element) => { element.disabled = true; });
    } else {
      setStatus(t("خدمة المجتمع متصلة.", "Community service connected."), "success");
    }
    initAuthForms();
    initChat();
    await validateStoredSession();
    initComments();
    renderFavorites();
    if (configured) {
      loadChat();
      chatTimer = window.setInterval(loadChat, Number(config.pollIntervalMs || 5000));
      syncFavorites();
    }
  };

  window.addEventListener("beforeunload", () => {
    window.clearInterval(chatTimer);
    commentTimers.forEach((timer) => window.clearInterval(timer));
  });

  initCommunity();
})();
