"use client";
import { RegisterDTO } from "@/proxy/auth/dto/register.dto";
import { RegisterErrors } from "@/proxy/auth/errors/register.error";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Input from "../../atoms/Input";
import { login, register } from "@/proxy/auth/auth-functions";
import CTA from "../../atoms/CTA";
import { useUser } from "@/app/Context/AuthContext/AuthUserProvider";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationEmail = searchParams.get("email") || "";
  const invitationToken = searchParams.get("invitation") || "";
  const redirectParam = searchParams.get("redirect");
  const redirectPath =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/auth/login";
  const [registerCredentials, setRegisterCredentials] =
    React.useState<RegisterDTO>({
      firstname: "",
      lastname: "",
      email: invitationEmail,
      password: "",
      confirmation: "",
      invitationToken,
      accessKey: "",
    });
  const [hasAcceptedPrivacyPolicy, setHasAcceptedPrivacyPolicy] =
    React.useState(false);

  const isFormValid =
    Object.values(registerCredentials).every((value) => value.trim() !== "") &&
    hasAcceptedPrivacyPolicy;

  function setCredentialsInfo(e: React.ChangeEvent<HTMLInputElement>) {
    setRegisterCredentials({
      ...registerCredentials,
      [e.target.name]: e.target.value,
    });
  }

  const [errorMessages, setErrorMessages] =
    React.useState<RegisterErrors | null>(null);
  const [unauthorizedError, setUnauthorizedError] = React.useState<
    string | null
  >(null);

  const { setUser } = useUser();

  function createErrorObject(errors: string[]) {
    const errorObj: Record<string, string[]> = {};
    for (const errorKey in errors) {
      if (!errorObj[errorKey]) {
        errorObj[errorKey] = [];
        errorObj[errorKey].push(errors[errorKey]);
      } else {
        errorObj[errorKey].push(errors[errorKey]);
      }
    }

    return errorObj;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!hasAcceptedPrivacyPolicy) {
      return;
    }

    setErrorMessages(null);
    setUnauthorizedError(null);

    const response = await register(registerCredentials);
    const result = await response.json();
    console.log(result);
    if (result.statusCode === 400) {
      if (Array.isArray(result.errors)) setErrorMessages(createErrorObject(result.errors));
      else setUnauthorizedError(result.message || 'Les informations fournies sont invalides.');
    }

    if (result.statusCode === 401) {
      setUnauthorizedError(result.message);
    }

    if (response.status === 201) {
      const loginResponse = await login({
        email: registerCredentials.email,
        password: registerCredentials.password,
      });
      const loginResult = await loginResponse.json();

      if (loginResponse.ok) {
        setUser(loginResult.user);
        router.push(redirectPath);
        return;
      }

      router.push(`/auth/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }

  return (
    <>
      <div className="max-w-96 flex flex-col justify-center items-stretch gap-8 mx-auto md:max-w-xl">
        <form
          method="post"
          className="flex flex-col justify-center items-stretch gap-4"
          onSubmit={handleSubmit}
        >
          {unauthorizedError && (
            <p className="text-red-500 mb-4">{unauthorizedError}</p>
          )}

          <div className="w-full space-y-4 md:flex md:flex-row md:gap-8">
            <div className="left-side space-y-4 basis-1/2">
              <div className="firstname-block">
                <Input
                  type="text"
                  label="Prénom:"
                  name="firstname"
                  placeholder="John"
                  value={registerCredentials.firstname}
                  onChange={setCredentialsInfo}
                />
                
                {errorMessages &&
                  errorMessages.firstname &&
                  errorMessages.firstname.length > 0 && (
                    <>
                      {errorMessages.firstname.map((error, index) => (
                        <p className="text-red-500" key={index}>
                          {error}
                        </p>
                      ))}
                    </>
                  )}
              </div>
              <div className="lastname-block">
                <Input
                  type="text"
                  label="Nom:"
                  name="lastname"
                  placeholder="Doe"
                  value={registerCredentials.lastname}
                  onChange={setCredentialsInfo}
                />
                {errorMessages &&
                  errorMessages.lastname &&
                  errorMessages.lastname.length > 0 && (
                    <>
                      {errorMessages.lastname.map((error, index) => (
                        <p className="text-red-500" key={index}>
                          {error}
                        </p>
                      ))}
                    </>
                  )}
              </div>
              <div className="email-block">
                <Input
                  type="email"
                  label="Email:"
                  name="email"
                  placeholder="johndoe@gmail.com"
                  value={registerCredentials.email}
                  onChange={setCredentialsInfo}
                  disabled={Boolean(invitationEmail)}
                />
                {invitationEmail && invitationToken && (
                  <p className="text-sm text-gray-500">L’adresse email est liée à votre invitation.</p>
                )}
                {errorMessages &&
                  errorMessages.email &&
                  errorMessages.email.length > 0 && (
                    <>
                      {errorMessages.email.map((error, index) => (
                        <p className="text-red-500" key={index}>
                          {error}
                        </p>
                      ))}
                    </>
                  )}
              </div>
            </div>

            <div className="right-side space-y-4 basis-1/2">
              <div className="password-block">
                <Input
                  type="password"
                  label="Mot de passe:"
                  name="password"
                  placeholder="Entrez votre mot de passe"
                  value={registerCredentials.password}
                  onChange={setCredentialsInfo}
                />
                {errorMessages &&
                  errorMessages.password &&
                  errorMessages.password.length > 0 && (
                    <>
                      {errorMessages.password.map((error, index) => (
                        <p className="text-red-500" key={index}>
                          {error}
                        </p>
                      ))}
                    </>
                  )}
              </div>
              <div className="confirmation-block">
                <Input
                  type="password"
                  label="Confirmation du mot de passe:"
                  name="confirmation"
                  placeholder="Confirmez votre mot de passe"
                  value={registerCredentials.confirmation}
                  onChange={setCredentialsInfo}
                />
                {errorMessages &&
                  errorMessages.confirmation &&
                  errorMessages.confirmation.length > 0 && (
                    <>
                      {errorMessages.confirmation.map((error, index) => (
                        <p className="text-red-500" key={index}>
                          {error}
                        </p>
                      ))}
                    </>
                  )}
              </div>
              <div className="access-key-block">
                <Input
                  type="text"
                  label="Clé d’accès reçue par email:"
                  name="accessKey"
                  placeholder="Collez votre clé d’accès"
                  value={registerCredentials.accessKey}
                  onChange={setCredentialsInfo}
                />
                {!invitationEmail || !invitationToken ? (
                  <p className="mt-2 text-sm text-red-500">Utilisez le lien d’invitation reçu par email pour créer votre compte.</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              id="privacy-policy-consent"
              name="privacy-policy-consent"
              type="checkbox"
              checked={hasAcceptedPrivacyPolicy}
              onChange={(event) => setHasAcceptedPrivacyPolicy(event.target.checked)}
              aria-label="Accepter la Politique de confidentialité"
              aria-describedby="privacy-policy-consent-description"
              className="mt-0.5 size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            />
            <p id="privacy-policy-consent-description" className="text-sm leading-6 text-gray-600">
              Je confirme avoir lu et accepte la{' '}
              <a
                href="/legal#politique-de-confidentialite"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Politique de confidentialité
              </a>
              .
            </p>
          </div>

          <CTA
            type="button"
            color="primary"
            text="M'inscrire"
            disabled={!isFormValid}
          />

          <p className="mt-4">
            Déja un compte ?{" "}
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(redirectPath)}${invitationEmail ? `&email=${encodeURIComponent(invitationEmail)}` : ''}`}
              className="hover:underline hover:text-blue-500"
            >
              Me connecter
            </Link>
          </p>
        </form>

        <div className="relative">
          <hr className="w-full text-stroke"></hr>
          <p className="text-stroke absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4">
            Ou
          </p>
        </div>

        <div className="google-auth flex flex-col gap-4 items-stretch">
          <CTA
            type="button"
            color="secondary"
            text="Se connecter avec Google"
            iconImage={{
              src: "/logos/brand_logos/google.svg",
              alt: "Google icon",
            }}
            onClick={() => router.push("/auth/google")}
          />
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
