/*
 * ExamSeat Authentication
 *
 * Upgraded from localStorage-only (ST1) to API-backed auth.
 * Changes:
 *   - Signup  → POST /api/auth/signup
 *   - Login   → POST /api/auth/login  (returns JWT)
 *   - JWT stored in localStorage as "examSeatToken"
 *   - All original validation, UI flow, and form behaviour preserved.
 */

(function () {

  "use strict";


  /* =========================================================
     API BASE
     ========================================================= */

  const API = "/api/auth";


  /* =========================================================
     LOGIN ELEMENTS
     ========================================================= */

  const loginForm =
    document.getElementById(
      "loginForm"
    );


  const loginMessage =
    document.getElementById(
      "loginMessage"
    );


  /* =========================================================
     SIGNUP ELEMENTS
     ========================================================= */

  const signupForm =
    document.getElementById(
      "signupForm"
    );


  const signupMessage =
    document.getElementById(
      "signupMessage"
    );


  /* =========================================================
     MESSAGE HANDLER
     ========================================================= */

  function setMessage(
    element,
    message,
    type
  ) {

    if (!element) {
      return;
    }

    element.textContent =
      message;

    element.className =
      "form-message";

    if (type) {
      element.classList.add(
        `form-message--${type}`
      );
    }
  }


  /* =========================================================
     DISABLE / ENABLE FORM
     ========================================================= */

  function setFormBusy(
    form,
    busy
  ) {

    if (!form) {
      return;
    }

    const buttons =
      form.querySelectorAll(
        "button"
      );

    buttons.forEach(
      (button) => {
        button.disabled = busy;
      }
    );
  }


  /* =========================================================
     SIGNUP
     ========================================================= */

  if (signupForm) {

    signupForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        /* -----------------------------------------
           GET FORM VALUES
           ----------------------------------------- */

        const name =
          document
            .getElementById("signupName")
            .value
            .trim();

        const identifier =
          document
            .getElementById("signupIdentifier")
            .value
            .trim();

        const password =
          document
            .getElementById("signupPassword")
            .value;

        const confirmPassword =
          document
            .getElementById("signupConfirmPassword")
            .value;

        const role =
          document
            .getElementById("signupRole")
            .value;

        const teacherCode =
          document
            .getElementById("teacherCode")
            .value
            .trim();


        setMessage(signupMessage, "", "");


        /* -----------------------------------------
           CLIENT-SIDE VALIDATION (preserved from ST1)
           ----------------------------------------- */

        if (!name) {
          setMessage(signupMessage, "Please enter your full name.", "error");
          return;
        }

        if (!identifier) {
          setMessage(signupMessage, "Please enter your Student ID or email.", "error");
          return;
        }

        if (!password) {
          setMessage(signupMessage, "Please create a password.", "error");
          return;
        }

        if (password.length < 6) {
          setMessage(signupMessage, "Password must be at least 6 characters.", "error");
          return;
        }

        if (password !== confirmPassword) {
          setMessage(signupMessage, "Passwords do not match.", "error");
          return;
        }

        if (role !== "student" && role !== "teacher") {
          setMessage(signupMessage, "Please select an account type.", "error");
          return;
        }


        /* -----------------------------------------
           CALL API
           ----------------------------------------- */

        setFormBusy(signupForm, true);

        try {

          const response =
            await fetch(
              `${API}/signup`,
              {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({
                  name,
                  identifier,
                  password,
                  role,
                  teacherCode
                })
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            setMessage(
              signupMessage,
              data.message || "Signup failed.",
              "error"
            );
            return;
          }

          /* -----------------------------------------
             SUCCESS — mirror original flow
             ----------------------------------------- */

          setMessage(
            signupMessage,
            "Account created successfully. You can now sign in.",
            "success"
          );

          signupForm.reset();

          /* Reset teacher code field */
          const teacherCodeGroup =
            document.getElementById("teacherCodeGroup");

          if (teacherCodeGroup) {
            teacherCodeGroup.hidden = true;
          }

          const teacherCodeInput =
            document.getElementById("teacherCode");

          if (teacherCodeInput) {
            teacherCodeInput.required = false;
          }

          /* Return to login after 900 ms */
          setTimeout(
            function () {

              const loginCard =
                document.querySelector(
                  ".auth-card:not(#signupCard)"
                );

              const signupCard =
                document.getElementById("signupCard");

              if (signupCard) {
                signupCard.hidden = true;
              }

              if (loginCard) {
                loginCard.hidden = false;
              }

              const loginIdentifier =
                document.getElementById("loginIdentifier");

              if (loginIdentifier) {
                loginIdentifier.value = identifier;
                loginIdentifier.focus();
              }

              setMessage(signupMessage, "", "");

            },
            900
          );

        } catch (error) {

          setMessage(
            signupMessage,
            "Network error. Please check your connection.",
            "error"
          );

        } finally {

          setFormBusy(signupForm, false);

        }

      }
    );

  }


  /* =========================================================
     LOGIN
     ========================================================= */

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        /* -----------------------------------------
           GET LOGIN VALUES
           ----------------------------------------- */

        const identifier =
          document
            .getElementById("loginIdentifier")
            .value
            .trim();

        const password =
          document
            .getElementById("loginPassword")
            .value;


        setMessage(loginMessage, "", "");


        /* -----------------------------------------
           EMPTY FIELD VALIDATION
           ----------------------------------------- */

        if (!identifier || !password) {
          setMessage(
            loginMessage,
            "Please enter your credentials.",
            "error"
          );
          return;
        }


        /* -----------------------------------------
           CALL API
           ----------------------------------------- */

        setFormBusy(loginForm, true);

        try {

          const response =
            await fetch(
              `${API}/login`,
              {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ identifier, password })
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            setMessage(
              loginMessage,
              data.message || "Login failed.",
              "error"
            );
            return;
          }

          /* -----------------------------------------
             STORE JWT + ROLE (replaces examSeatSession)
             ----------------------------------------- */

          localStorage.setItem(
            "examSeatToken",
            data.token
          );

          /* Keep a lightweight session object so teacher.js /
             student.js can read the user's name and role without
             making an extra API call.                          */
          localStorage.setItem(
            "examSeatSession",
            JSON.stringify({
              accountId:  data.account._id,
              name:       data.account.name,
              identifier: data.account.identifier,
              role:       data.account.role,
              loginAt:    new Date().toISOString()
            })
          );


          /* -----------------------------------------
             SUCCESS MESSAGE
             ----------------------------------------- */

          setMessage(
            loginMessage,
            "Login successful.",
            "success"
          );


          /* -----------------------------------------
             ROLE-BASED REDIRECT
             ----------------------------------------- */

          if (data.account.role === "student") {
            window.location.href = "student.html";
            return;
          }

          if (data.account.role === "teacher") {
            window.location.href = "teacher.html";
            return;
          }

          /* Invalid role (defensive) */
          localStorage.removeItem("examSeatToken");
          localStorage.removeItem("examSeatSession");
          setMessage(loginMessage, "Invalid account role.", "error");

        } catch (error) {

          setMessage(
            loginMessage,
            "Network error. Please check your connection.",
            "error"
          );

        } finally {

          setFormBusy(loginForm, false);

        }

      }
    );

  }

})();
