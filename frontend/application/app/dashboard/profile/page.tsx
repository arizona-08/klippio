"use client";
import Input from "@/app/components/atoms/Input";
import { useUser } from "@/app/Context/AuthContext/AuthUserProvider";
import {
  editPasswordInfo,
  editPersonalInfo,
  editUserPicture,
} from "@/proxy/profile/profile-functions";
import React, { useEffect } from "react";
import Toast from "@/app/components/molecules/Toast/Toast";
import PicturePreview from "@/app/components/molecules/ProfilePicturePreview/ProfilePicturePreview";
import { LogOut } from "lucide-react";
import { logout } from "@/proxy/auth/auth-functions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CTA from "@/app/components/atoms/CTA";

function ProfilePage() {
  const { user, setUser } = useUser();

  const [personalInfo, setPersonalInfo] = React.useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  const [passwordInfo, setPasswordInfo] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmationPassword: "",
  });

  const [isPicturePreviewOpen, setIsPicturePreviewOpen] = React.useState(false);

  const [newProfilePicture, setNewProfilePicture] = React.useState<{
    file: File | string;
    zoom: number;
    offsetX: number;
    offsetY: number;
  } | null>({
    file: user?.profilePicture?.url || "",
    zoom: user?.profilePicture?.zoom || 1,
    offsetX: user?.profilePicture?.offsetX || 0,
    offsetY: user?.profilePicture?.offsetY || 0,
  });

  const [newBannerPicture, setNewBannerPicture] = React.useState<{
    file: File | string;
    zoom: number;
    offsetX: number;
    offsetY: number;
  } | null>({
    file: user?.bannerPicture?.url || "",
    zoom: user?.bannerPicture?.zoom || 1,
    offsetX: user?.bannerPicture?.offsetX || 0,
    offsetY: user?.bannerPicture?.offsetY || 0,
  });

  const [profilePictureImageUrl, setProfilePictureImageUrl] = React.useState<
    string | null
  >(null);
  const [bannerPictureImageUrl, setBannerPictureImageUrl] = React.useState<
    string | null
  >(null);

  useEffect(() => {
    setNewBannerPicture({
      file: user?.bannerPicture?.url as string,
      zoom: user?.bannerPicture?.zoom as number,
      offsetX: (user?.bannerPicture?.offsetX as number) || 0,
      offsetY: (user?.bannerPicture?.offsetY as number) || 0,
    });

    setBannerPictureImageUrl(user?.bannerPicture?.url || null);

    setNewProfilePicture({
      file: user?.profilePicture?.url as string,
      zoom: (user?.profilePicture?.zoom as number) || 1,
      offsetX: (user?.profilePicture?.offsetX as number) || 0,
      offsetY: (user?.profilePicture?.offsetY as number) || 0,
    });
    setProfilePictureImageUrl(user?.profilePicture?.url || null);
  }, [user]);

  const [pictureType, setPictureType] = React.useState<"PROFILE" | "BANNER">(
    "PROFILE",
  );

  const resolvedBannerUrl =
    bannerPictureImageUrl ??
    (typeof newBannerPicture?.file === "string"
      ? newBannerPicture.file
      : user?.bannerPicture?.url) ??
    null;

  const resolvedProfileUrl =
    profilePictureImageUrl ??
    (typeof newProfilePicture?.file === "string"
      ? newProfilePicture.file
      : user?.profilePicture?.url) ??
    null;

  const profilePictureInputRef = React.useRef<HTMLInputElement>(null);
  const bannerPictureInputRef = React.useRef<HTMLInputElement>(null);

  const [personalInfoToast, setPersonalInfoToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [profilePictureToast, setProfilePictureToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [bannerPictureToast, setBannerPictureToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [passwordInfoToast, setPasswordInfoToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      });
    }
  }, [user]);

  async function handleEditPersonalInfo(e?: React.MouseEvent) {
    e?.preventDefault();
    const response = await editPersonalInfo(personalInfo);
    if (response.ok) {
      const data = await response.json();
      const updatedUser = data.updatedUser;
      setUser(updatedUser);
      console.log(data.message);
      setPersonalInfoToast({
        message: data.message,
        type: "success",
      });
    } else {
      setPersonalInfoToast({
        message: "Erreur lors de la mise à jour des informations personnelles",
        type: "error",
      });
    }
  }

  async function handleChangePictureInput(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "PROFILE" | "BANNER",
  ) {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      if (type === "PROFILE") {
        setNewProfilePicture({
          file: file,
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
        });
      } else {
        setNewBannerPicture({
          file: file,
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
        });
      }

      setPictureType(type);
      setIsPicturePreviewOpen(true);
    }

    // Reset to allow re-selecting the same file
    e.target.value = "";
  }

  async function HandleOnConfirmPicturePreview(
    data: { zoom: number; offsetX: number; offsetY: number },
    type: "PROFILE" | "BANNER",
  ) {
    if (type === "PROFILE" && newProfilePicture) {
      setNewProfilePicture({
        ...newProfilePicture,
        zoom: data.zoom,
        offsetX: data.offsetX,
        offsetY: data.offsetY,
      });
      setProfilePictureImageUrl(
        URL.createObjectURL(newProfilePicture.file as File),
      );
    }

    if (type === "BANNER" && newBannerPicture) {
      setNewBannerPicture({
        ...newBannerPicture,
        zoom: data.zoom,
        offsetX: data.offsetX,
        offsetY: data.offsetY,
      });
      setBannerPictureImageUrl(
        URL.createObjectURL(newBannerPicture.file as File),
      );
    }
  }

  async function handleEditPicture(
    e?: React.MouseEvent,
    type?: "PROFILE" | "BANNER",
  ) {
    e?.preventDefault();
    const formData = new FormData();

    if (type === "PROFILE" && newProfilePicture?.file) {
      formData.append("file", newProfilePicture.file);
      formData.append("type", "PROFILE");
      formData.append("zoom", newProfilePicture.zoom.toString());
      formData.append("offsetX", newProfilePicture.offsetX.toString());
      formData.append("offsetY", newProfilePicture.offsetY.toString());
    } else if (type === "BANNER" && newBannerPicture?.file) {
      formData.append("file", newBannerPicture.file);
      formData.append("type", "BANNER");
      formData.append("zoom", newBannerPicture.zoom.toString());
      formData.append("offsetX", newBannerPicture.offsetX.toString());
      formData.append("offsetY", newBannerPicture.offsetY.toString());
    } else {
      console.error("Aucun nouveau fichier de photo à télécharger.");
      return;
    }

    const response = await editUserPicture(formData);
    const data = await response.json();

    if (response.ok) {
      if (type === "PROFILE") {
        setProfilePictureToast({
          message: data.message,
          type: "success",
        });

        setUser({
          firstname: user?.firstname || "",
          lastname: user?.lastname || "",
          email: user?.email || "",
          profilePicture: {
            url: data.profilePicture.url,
            zoom: data.profilePicture.zoom,
            offsetX: data.profilePicture.offsetX,
            offsetY: data.profilePicture.offsetY,
          },
          bannerPicture: {
            url: user?.bannerPicture?.url || "",
            zoom: user?.bannerPicture?.zoom || 1,
            offsetX: user?.bannerPicture?.offsetX || 0,
            offsetY: user?.bannerPicture?.offsetY || 0,
          },
          role: user?.role || "STANDARD",
        });
      } else if (type === "BANNER") {
        setBannerPictureToast({
          message: data.message,
          type: "success",
        });
        setUser({
          firstname: user?.firstname || "",
          lastname: user?.lastname || "",
          email: user?.email || "",
          profilePicture: {
            url: user?.profilePicture?.url || "",
            zoom: user?.profilePicture?.zoom || 1,
            offsetX: user?.profilePicture?.offsetX || 0,
            offsetY: user?.profilePicture?.offsetY || 0,
          },
          bannerPicture: {
            url: data.bannerPicture.url,
            zoom: data.bannerPicture.zoom,
            offsetX: data.bannerPicture.offsetX,
            offsetY: data.bannerPicture.offsetY,
          },
          role: user?.role || "STANDARD",
        });
      }

      // Optionnel : mettre à jour l'URL de la photo de profil dans le contexte utilisateur si nécessaire
    } else {
      setProfilePictureToast({
        message:
          data.message || "Erreur lors de la mise à jour de la photo de profil",
        type: "error",
      });
    }
  }

  async function handleEditPassword(e?: React.MouseEvent) {
    e?.preventDefault();
    const response = await editPasswordInfo(passwordInfo);

    const data = await response.json();
    if (data.success) {
      setPasswordInfoToast({
        message: data.message,
        type: "success",
      });

      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmationPassword: "",
      });
    } else {
      setPasswordInfoToast({
        message: data.message,
        type: "error",
      });
    }
  }

  const [isLogoutLoading, setIsLogoutLoading] = React.useState(false);
  const router = useRouter();

  async function handleLogout(e?: React.MouseEvent) {
    e?.preventDefault();
    setIsLogoutLoading(true);

    const response = await logout();

    if (response.ok) {
      setUser(undefined);
      router.push("/auth/login");
    }
  }

  return (
    <>
      <PicturePreview
        isVisible={isPicturePreviewOpen}
        type={pictureType}
        file={
          pictureType === "PROFILE"
            ? (newProfilePicture?.file as File)
            : (newBannerPicture?.file as File)
        }
        onClose={() => setIsPicturePreviewOpen(false)}
        onConfirm={HandleOnConfirmPicturePreview}
      />
      <div className="p-4">
        {/* profile header */}
        <section className="relative w-full h-52 bg-gray-200 rounded-md mb-24">
          <div className="absolute inset-0 overflow-hidden rounded-md">
            {resolvedBannerUrl && (
              <Image
                src={resolvedBannerUrl}
                alt="Banniere de profil"
                fill
                sizes="100vw"
                className="select-none object-cover"
                unoptimized
                style={{ width: "100%", height: "100%" }}
                draggable={false}
              />
            )}
          </div>

          <div className="absolute -bottom-18 left-2 flex items-center gap-2">
            {/* Profile picture */}
            <div className="w-24 h-24 rounded-full bg-gray-400 border-4 border-white overflow-hidden">
              {resolvedProfileUrl && (
                <Image
                  src={resolvedProfileUrl}
                  alt="Photo de profil"
                  width={96}
                  height={96}
                  sizes="96px"
                  className="h-full w-full object-cover"
                  draggable={false}
                  unoptimized
                />
              )}
            </div>

            <div className="mt-8">
              <h1 className="text-xl font-semibold">
                {user?.firstname} {user?.lastname}
              </h1>
              <p className="text-gray-600 text-sm">{user?.email}</p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:mx-auto">
          <div>
            <h2 className="font-medium">Informations personnelles</h2>
            <p className="text-sm text-gray-600 mt-1">
              Mettez à jour vos informations personnelles à tout moment.
            </p>

            {personalInfoToast && (
              <div className="mt-4">
                <Toast
                  message={personalInfoToast.message}
                  type={personalInfoToast.type}
                  durationMs={3000}
                  onClose={() => setPersonalInfoToast(null)}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-md p-4 w-full md:max-w-2xl border border-gray-200">
            <form className="space-y-6">
              <div className="space-y-6 md:flex md:items-center md:gap-4 md:space-y-0">
                <Input
                  label="Prénom"
                  type="text"
                  name="firstname"
                  placeholder="Entrez votre prénom"
                  value={personalInfo.firstname}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      firstname: e.target.value,
                    })
                  }
                  className="md:flex-1"
                />

                <Input
                  label="Nom"
                  type="text"
                  name="lastname"
                  placeholder="Entrez votre nom"
                  value={personalInfo.lastname}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      lastname: e.target.value,
                    })
                  }
                  className="md:flex-1"
                />
              </div>

              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="Entrez votre email"
                value={personalInfo.email}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, email: e.target.value })
                }
              />

              <div className="flex justify-end">
                <CTA
                  color="primary"
                  text="Enregistrer"
                  type="button"
                  onClick={handleEditPersonalInfo}
                />
              </div>
            </form>
          </div>
        </section>

        {/* Banner picture section */}
        <section className="mt-12 max-w-7xl flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:mx-auto">
          <div>
            <h2 className="font-medium">Photo de banniere</h2>
            <p className="text-sm text-gray-600 mt-1">
              Mettez à jour votre photo de banniere.
            </p>

            {bannerPictureToast && (
              <div className="mt-4">
                <Toast
                  message={bannerPictureToast.message}
                  type={bannerPictureToast.type}
                  durationMs={3000}
                  onClose={() => setBannerPictureToast(null)}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-md p-4 w-full md:max-w-2xl border border-gray-200">
            <form className="space-y-6">
              {bannerPictureImageUrl ? (
                <>
                  <div className="relative w-full h-32 rounded-lg bg-gray-400 border-4 border-gray-200 overflow-hidden mx-auto">
                    <Image
                      src={bannerPictureImageUrl}
                      alt="Aperçu de la photo de profil"
                      fill // Remplace width, height et absolute
                      sizes="100vw"
                      className="select-none object-cover" // object-cover empêche la déformation
                      style={{
                        transform: `translate(${newBannerPicture?.offsetX}px, ${newBannerPicture?.offsetY}px) scale(${newBannerPicture?.zoom})`,
                      }}
                      draggable={false}
                      unoptimized
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-32 rounded-lg bg-gray-400 border-4 border-gray-200 mx-auto"></div>
                </>
              )}

              <div className="flex justify-end gap-6">
                <CTA
                  color="secondary"
                  text="Choisir une photo"
                  type="button"
                  onClick={(e) => {
                    e?.preventDefault();
                    bannerPictureInputRef.current?.click();
                  }}
                />

                <CTA
                  color="primary"
                  text="Enregistrer"
                  type="button"
                  onClick={(e) => handleEditPicture(e, "BANNER")}
                />
              </div>
            </form>
          </div>
        </section>

        {/* Profile picture section */}
        <section className="mt-12 max-w-7xl flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:mx-auto">
          <div>
            <h2 className="font-medium">Photo de profil</h2>
            <p className="text-sm text-gray-600 mt-1">
              Mettez à jour votre photo de profil.
            </p>

            {profilePictureToast && (
              <div className="mt-4">
                <Toast
                  message={profilePictureToast.message}
                  type={profilePictureToast.type}
                  durationMs={3000}
                  onClose={() => setProfilePictureToast(null)}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-md p-4 w-full md:max-w-2xl border border-gray-200">
            <form className="space-y-6">
              {profilePictureImageUrl ? (
                <>
                  <div className="relative w-32 h-32 rounded-full bg-gray-400 border-4 border-gray-200 overflow-hidden mx-auto">
                    <Image
                      src={profilePictureImageUrl}
                      alt="Aperçu de la photo de profil"
                      fill
                      sizes="100vw"
                      className="select-none object-cover"
                      style={{
                        transform: `translate(${newProfilePicture?.offsetX}px, ${newProfilePicture?.offsetY}px) scale(${newProfilePicture?.zoom})`,
                      }}
                      unoptimized
                      draggable={false}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 rounded-full bg-gray-400 border-4 border-gray-200 mx-auto"></div>
                </>
              )}

              <div className="flex justify-end gap-6">
                <CTA
                  color="secondary"
                  text="Choisir une photo"
                  type="button"
                  onClick={(e) => {
                    e?.preventDefault();
                    profilePictureInputRef.current?.click();
                  }}
                />

                <CTA
                  color="primary"
                  text="Enregistrer"
                  type="button"
                  onClick={(e) => handleEditPicture(e, "PROFILE")}
                />
              </div>
            </form>
          </div>
        </section>

        <section className="max-w-7xl flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:mx-auto  mt-12">
          <div>
            <h2 className="font-medium">Sécurité</h2>
            <p className="text-sm text-gray-600 mt-1">
              Changez votre mot de passe en toute sécurité.
            </p>

            {passwordInfoToast && (
              <div className="mt-4">
                <Toast
                  message={passwordInfoToast.message}
                  type={passwordInfoToast.type}
                  durationMs={3000}
                  onClose={() => setPasswordInfoToast(null)}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-md p-4 w-full md:max-w-2xl border border-gray-200">
            <form className="space-y-6">
              <Input
                label="Mot de passe actuel"
                type="password"
                name="currentPassword"
                placeholder="Entrez votre mot de passe actuel"
                value={passwordInfo.currentPassword}
                onChange={(e) =>
                  setPasswordInfo({
                    ...passwordInfo,
                    currentPassword: e.target.value,
                  })
                }
              />

              <Input
                label="Nouveau mot de passe"
                type="password"
                name="new-password"
                placeholder="Entrez votre nouveau mot de passe"
                value={passwordInfo.newPassword}
                onChange={(e) =>
                  setPasswordInfo({
                    ...passwordInfo,
                    newPassword: e.target.value,
                  })
                }
              />

              <Input
                label="Confirmation du mot de passe"
                type="password"
                name="confirmation-password"
                placeholder="Confirmez votre nouveau mot de passe"
                value={passwordInfo.confirmationPassword}
                onChange={(e) =>
                  setPasswordInfo({
                    ...passwordInfo,
                    confirmationPassword: e.target.value,
                  })
                }
              />

              <div className="flex justify-end">
                <CTA
                  color="primary"
                  text="Enregistrer"
                  type="button"
                  onClick={handleEditPassword}
                />
              </div>
            </form>
          </div>
        </section>

        {/* logout section */}
        <section className="mt-12 flex flex-col items-end max-w-7xl mx-auto">
          <div className="min-w-65 flex flex-col items-stretch">
            <CTA
              color="danger"
              text="Me déconnecter"
              type="button"
              onClick={handleLogout}
              icon={<LogOut className="w-5 h-5" />}
              iconReverse={true}
              isLoading={isLogoutLoading}
            />
          </div>
        </section>
      </div>

      <input
        type="file"
        name="profile-picture"
        id="profile-picture"
        className="hidden"
        onChange={(e) => {
          handleChangePictureInput(e, "PROFILE");
        }}
        ref={profilePictureInputRef}
      />

      <input
        type="file"
        name="banner-picture"
        id="banner-picture"
        className="hidden"
        onChange={(e) => {
          handleChangePictureInput(e, "BANNER");
        }}
        ref={bannerPictureInputRef}
      />
    </>
  );
}

export default ProfilePage;
