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
    });

  const isFormValid = Object.values(registerCredentials).every(
    (value) => value.trim() !== "",
  );

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
    setErrorMessages(null);
    setUnauthorizedError(null);

    const response = await register(registerCredentials);
    const result = await response.json();
    console.log(result);
    if (result.statusCode === 400) {
      const errorObj = createErrorObject(result.errors);
      setErrorMessages(errorObj);
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
                  onChange={setCredentialsInfo}
                  disabled={Boolean(invitationEmail)}
                />
                {invitationEmail && (
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
            </div>
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
