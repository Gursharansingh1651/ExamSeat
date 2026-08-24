/*
 * ExamSeat Authentication - Step 4
 *
 * - Student / Teacher signup
 * - Login authentication
 * - Local session creation
 * - Role-based dashboard redirection
 *
 * NOTE:
 * This is still the ST1 frontend/localStorage authentication.
 * Production authentication should eventually be moved to a backend.
 */

(function () {

  "use strict";


  /* =========================================================
     STORAGE
     ========================================================= */

  const ACCOUNTS_KEY =
    "examSeatAccounts";


  /*
   * Temporary teacher registration code
   * for the ST1 prototype.
   */

  const TEACHER_REGISTRATION_CODE =
    "EXAMSEAT-TEACHER";


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
     GET ACCOUNTS
     ========================================================= */

  function getAccounts() {

    try {

      const saved =
        localStorage.getItem(
          ACCOUNTS_KEY
        );


      const accounts =
        saved
          ? JSON.parse(saved)
          : [];


      return Array.isArray(
        accounts
      )
        ? accounts
        : [];

    } catch (error) {

      return [];

    }

  }


  /* =========================================================
     SAVE ACCOUNTS
     ========================================================= */

  function saveAccounts(
    accounts
  ) {

    localStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify(
        accounts
      )
    );

  }


  /* =========================================================
     NORMALIZE IDENTIFIER
     ========================================================= */

  function normalizeIdentifier(
    value
  ) {

    return String(
      value || ""
    )
      .trim()
      .toLowerCase();

  }


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
     CREATE ACCOUNT ID
     ========================================================= */

  function createAccountId() {

    return (
      `account-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`
    );

  }


  /* =========================================================
     SIGNUP
     ========================================================= */

  if (signupForm) {

    signupForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        /* -----------------------------------------
           GET FORM VALUES
           ----------------------------------------- */

        const name =
          document
            .getElementById(
              "signupName"
            )
            .value
            .trim();


        const identifier =
          document
            .getElementById(
              "signupIdentifier"
            )
            .value
            .trim();


        const password =
          document
            .getElementById(
              "signupPassword"
            )
            .value;


        const confirmPassword =
          document
            .getElementById(
              "signupConfirmPassword"
            )
            .value;


        const role =
          document
            .getElementById(
              "signupRole"
            )
            .value;


        const teacherCode =
          document
            .getElementById(
              "teacherCode"
            )
            .value
            .trim();


        setMessage(
          signupMessage,
          "",
          ""
        );


        /* -----------------------------------------
           NAME VALIDATION
           ----------------------------------------- */

        if (!name) {

          setMessage(
            signupMessage,
            "Please enter your full name.",
            "error"
          );

          return;

        }


        /* -----------------------------------------
           IDENTIFIER VALIDATION
           ----------------------------------------- */

        if (!identifier) {

          setMessage(
            signupMessage,
            "Please enter your Student ID or email.",
            "error"
          );

          return;

        }


        /* -----------------------------------------
           PASSWORD VALIDATION
           ----------------------------------------- */

        if (!password) {

          setMessage(
            signupMessage,
            "Please create a password.",
            "error"
          );

          return;

        }


        if (
          password.length < 6
        ) {

          setMessage(
            signupMessage,
            "Password must be at least 6 characters.",
            "error"
          );

          return;

        }


        /* -----------------------------------------
           PASSWORD CONFIRMATION
           ----------------------------------------- */

        if (
          password !==
          confirmPassword
        ) {

          setMessage(
            signupMessage,
            "Passwords do not match.",
            "error"
          );

          return;

        }


        /* -----------------------------------------
           ROLE VALIDATION
           ----------------------------------------- */

        if (
          role !== "student" &&
          role !== "teacher"
        ) {

          setMessage(
            signupMessage,
            "Please select an account type.",
            "error"
          );

          return;

        }


        /* -----------------------------------------
           TEACHER REGISTRATION CODE
           ----------------------------------------- */

        if (
          role === "teacher" &&
          teacherCode !==
            TEACHER_REGISTRATION_CODE
        ) {

          setMessage(
            signupMessage,
            "Invalid teacher registration code.",
            "error"
          );

          return;

        }


        /* -----------------------------------------
           GET EXISTING ACCOUNTS
           ----------------------------------------- */

        const accounts =
          getAccounts();


        const normalizedIdentifier =
          normalizeIdentifier(
            identifier
          );


        /* -----------------------------------------
           DUPLICATE ACCOUNT CHECK
           ----------------------------------------- */

        const duplicate =
          accounts.some(
            function (account) {

              return (
                normalizeIdentifier(
                  account.identifier
                ) ===
                normalizedIdentifier
              );

            }
          );


        if (duplicate) {

          setMessage(
            signupMessage,
            "An account with these credentials already exists.",
            "error"
          );

          return;

        }


        /* -----------------------------------------
           CREATE ACCOUNT
           ----------------------------------------- */

        const account = {

          id:
            createAccountId(),

          name:
            name,

          identifier:
            identifier,

          role:
            role,

          password:
            password,

          createdAt:
            new Date().toISOString()

        };


        /* -----------------------------------------
           SAVE ACCOUNT
           ----------------------------------------- */

        accounts.push(
          account
        );


        saveAccounts(
          accounts
        );


        /* -----------------------------------------
           SUCCESS MESSAGE
           ----------------------------------------- */

        setMessage(
          signupMessage,
          "Account created successfully. You can now sign in.",
          "success"
        );


        /* -----------------------------------------
           RESET SIGNUP FORM
           ----------------------------------------- */

        signupForm.reset();


        /* -----------------------------------------
           RESET TEACHER CODE FIELD
           ----------------------------------------- */

        const teacherCodeGroup =
          document.getElementById(
            "teacherCodeGroup"
          );


        if (teacherCodeGroup) {

          teacherCodeGroup.hidden =
            true;

        }


        const teacherCodeInput =
          document.getElementById(
            "teacherCode"
          );


        if (teacherCodeInput) {

          teacherCodeInput.required =
            false;

        }


        /* -----------------------------------------
           RETURN TO LOGIN
           ----------------------------------------- */

        setTimeout(
          function () {

            const loginCard =
              document.querySelector(
                ".auth-card:not(#signupCard)"
              );


            const signupCard =
              document.getElementById(
                "signupCard"
              );


            if (signupCard) {

              signupCard.hidden =
                true;

            }


            if (loginCard) {

              loginCard.hidden =
                false;

            }


            const loginIdentifier =
              document.getElementById(
                "loginIdentifier"
              );


            if (loginIdentifier) {

              loginIdentifier.value =
                identifier;

              loginIdentifier.focus();

            }


            setMessage(
              signupMessage,
              "",
              ""
            );

          },
          900
        );

      }
    );

  }


  /* =========================================================
     LOGIN
     ========================================================= */

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      function (event) {

        event.preventDefault();


        /* -----------------------------------------
           GET LOGIN VALUES
           ----------------------------------------- */

        const identifier =
          document
            .getElementById(
              "loginIdentifier"
            )
            .value
            .trim();


        const password =
          document
            .getElementById(
              "loginPassword"
            )
            .value;


        setMessage(
          loginMessage,
          "",
          ""
        );


        /* -----------------------------------------
           EMPTY FIELD VALIDATION
           ----------------------------------------- */

        if (
          !identifier ||
          !password
        ) {

          setMessage(
            loginMessage,
            "Please enter your credentials.",
            "error"
          );

          return;

        }


        /* -----------------------------------------
           NORMALIZE IDENTIFIER
           ----------------------------------------- */

        const normalizedIdentifier =
          normalizeIdentifier(
            identifier
          );


        /* -----------------------------------------
           GET ACCOUNTS
           ----------------------------------------- */

        const accounts =
          getAccounts();


        /* -----------------------------------------
           FIND ACCOUNT
           ----------------------------------------- */

        const account =
          accounts.find(
            function (item) {

              return (
                normalizeIdentifier(
                  item.identifier
                ) ===
                normalizedIdentifier
              );

            }
          );


        /* -----------------------------------------
           ACCOUNT NOT FOUND
           ----------------------------------------- */

        if (!account) {

          setMessage(
            loginMessage,
            "No account was found with those credentials.",
            "error"
          );

          return;

        }


        /* -----------------------------------------
           PASSWORD CHECK
           ----------------------------------------- */

        if (
          account.password !==
          password
        ) {

          setMessage(
            loginMessage,
            "Incorrect password.",
            "error"
          );

          return;

        }


        /* =================================================
           CREATE LOGIN SESSION
           ================================================= */

        const session = {

          accountId:
            account.id,

          name:
            account.name,

          identifier:
            account.identifier,

          role:
            account.role,

          loginAt:
            new Date().toISOString()

        };


        localStorage.setItem(
          "examSeatSession",
          JSON.stringify(
            session
          )
        );


        /* -----------------------------------------
           LOGIN SUCCESS MESSAGE
           ----------------------------------------- */

        setMessage(
          loginMessage,
          "Login successful.",
          "success"
        );


        /* =================================================
           STEP 4 — ROLE BASED REDIRECTION
           ================================================= */

        if (
          account.role ===
          "student"
        ) {

          window.location.href =
            "student.html";

          return;

        }


        if (
          account.role ===
          "teacher"
        ) {

          window.location.href =
            "teacher.html";

          return;

        }


        /* -----------------------------------------
           INVALID ROLE
           ----------------------------------------- */

        localStorage.removeItem(
          "examSeatSession"
        );


        setMessage(
          loginMessage,
          "Invalid account role.",
          "error"
        );

      }
    );

  }

})();