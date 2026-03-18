import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setAdminModalOpen,
  setAvatar,
  clearAvatar,
  setAvatarLoadedSuccess,
  setNickname,
  setNicknameDraft,
  setNicknameError,
  resetNicknameDraft,
  clearUser,
} from "@/features/auth/model";
import { getDisplayNickname } from "@/features/auth/lib/displayNickname";
import { InitialsAvatar } from "@/components/atoms/InitialsAvatar";
import { Field } from "@/components/atoms/Field";
import { useT } from "@/features/i18n";
import { pushToast } from "@/features/notifications/model/notificationsSlice";
import {
  uploadAvatar,
  deleteAvatar as deleteAvatarApi,
  getAvatarUrl,
  setNickname as setNicknameApi,
} from "@/shared/api/authApi";
import {
  compressAvatarImage,
  AVATAR_MAX_FILE_SIZE_BYTES,
} from "@/shared/utils/avatarImage";
import {
  AvatarWrap,
  Dropdown,
  DropdownName,
  DropdownEmail,
  DropdownActions,
  DropdownBtn,
  DropdownLogoutRow,
  LogoutBtn,
  DropdownNicknameRow,
  NicknameInputRow,
  NicknameFieldWrap,
  NicknameFieldGlobalStyles,
  nicknameFieldClassNames,
  NicknameSaveBtn,
  LogoutIconWrap,
} from "./UserAvatar.styled";

function LogoutIcon() {
  return (
    <LogoutIconWrap aria-hidden>
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1={21} y1={12} x2={9} y2={12} />
      </svg>
    </LogoutIconWrap>
  );
}

const MAX_SIZE_MB = AVATAR_MAX_FILE_SIZE_BYTES / (1024 * 1024);

export interface UserAvatarProps {
  name: string;
  email: string;
  size?: number;
  /** If true, dropdown shows "Change photo" / "Remove photo". */
  isCurrentUser?: boolean;
  /** If false, avatar is not clickable and no dropdown (e.g. in event modal). Default true. */
  showDropdown?: boolean;
  /** Tooltip text on hover (e.g. nickname for other users; only they see this). */
  displayTitle?: string;
}

export function UserAvatar({
  name,
  email,
  size = 28,
  isCurrentUser = false,
  showDropdown = true,
  displayTitle,
}: UserAvatarProps) {
  const t = useT();
  const dispatch = useAppDispatch();
  const avatars = useAppSelector((s) => s.auth.avatars);
  const avatarLoadedSuccess = useAppSelector((s) => s.auth.avatarLoadedSuccess);
  const currentUser = useAppSelector((s) => s.auth.user);
  const nicknameDraft = useAppSelector((s) => s.auth.nicknameDraft);
  const nicknameError = useAppSelector((s) => s.auth.nicknameError);
  const [open, setOpen] = useState(false);
  const [nicknameSaving, setNicknameSaving] = useState(false);
  const nicknameStub = getDisplayNickname(currentUser);
  const [dropdownPosition, setDropdownPosition] = useState<{
    left: number;
    top: number;
    maxHeight: number;
    rightEdge: number;
  } | null>(null);

  // Be defensive about role string format (localStorage may contain older variants).
  const roleStr = (currentUser?.role ?? "").toString().toLowerCase().trim();
  const isSuperAdmin =
    roleStr === "super-admin" ||
    roleStr === "superadmin" ||
    roleStr === "super_admin" ||
    roleStr === "super admin";
  const isAdmin = roleStr === "admin";
  const canOpenAdminPanel = isAdmin || isSuperAdmin;
  const wrapRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const DROPDOWN_MIN_WIDTH = 200;
  const DROPDOWN_EDGE_GAP = 8;
  const DROPDOWN_TOP_GAP = 8;
  const DROPDOWN_ESTIMATED_HEIGHT = 320;

  useLayoutEffect(() => {
    if (!open || !wrapRef.current) {
      setDropdownPosition(null);
      return;
    }
    const rect = wrapRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const dropdownWidth = dropdownRef.current
      ? dropdownRef.current.getBoundingClientRect().width
      : DROPDOWN_MIN_WIDTH;
    let left = centerX - dropdownWidth / 2;
    left = Math.max(
      DROPDOWN_EDGE_GAP,
      Math.min(left, viewportW - dropdownWidth - DROPDOWN_EDGE_GAP),
    );

    let top = rect.bottom + DROPDOWN_TOP_GAP;
    const spaceBelow = viewportH - top;
    const spaceAbove = rect.top - DROPDOWN_TOP_GAP;
    if (spaceBelow < DROPDOWN_ESTIMATED_HEIGHT && spaceAbove > spaceBelow) {
      top = rect.top - DROPDOWN_ESTIMATED_HEIGHT - DROPDOWN_TOP_GAP;
    }
    top = Math.max(
      DROPDOWN_TOP_GAP,
      Math.min(top, viewportH - DROPDOWN_EDGE_GAP - 80),
    );
    const maxHeight = Math.min(
      DROPDOWN_ESTIMATED_HEIGHT,
      viewportH - top - DROPDOWN_EDGE_GAP,
    );
    setDropdownPosition({ left, top, maxHeight, rightEdge: DROPDOWN_EDGE_GAP });
  }, [open]);

  useEffect(() => {
    if (open && isCurrentUser) dispatch(resetNicknameDraft());
  }, [open, isCurrentUser, dispatch]);

  const key = email.trim().toLowerCase();
  /** URL from Redux (after upload) or API; use getAvatarUrl so we try server on first load. */
  const imageUrl = key ? (avatars[key] ?? getAvatarUrl(key)) : undefined;
  const [imageError, setImageError] = useState(false);
  /** When another instance (e.g. modal) loaded the image, show it here too. */
  const showImageAnyway = Boolean(key && avatarLoadedSuccess[key]);

  useEffect(() => {
    setImageError(false);
  }, [key]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  const handleChangePhoto = () => {
    inputRef.current?.click();
  };

  const handleRemovePhoto = async () => {
    try {
      await deleteAvatarApi(email);
      dispatch(clearAvatar(email));
      setImageError(true);
      setOpen(false);
    } catch {
      dispatch(pushToast({ kind: "error", title: t("avatar.errorGeneric") }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !key) return;
    compressAvatarImage(file)
      .then((dataUrl) =>
        uploadAvatar(key, dataUrl).then((url) => {
          dispatch(setAvatar({ email: key, dataUrl: url }));
          setImageError(false);
        }),
      )
      .catch((err) => {
        const msg =
          err instanceof Error && err.message === "FILE_TOO_BIG"
            ? t("avatar.errorFileTooBig", { max: MAX_SIZE_MB })
            : err instanceof Error && err.message === "INVALID_TYPE"
              ? t("avatar.errorInvalidType")
              : t("avatar.errorGeneric");
        dispatch(pushToast({ kind: "error", title: msg }));
      });
  };

  const showImage = imageUrl && (!imageError || showImageAnyway);
  const tooltipTitle = displayTitle !== undefined ? displayTitle : email;
  const avatarContent = (
    <InitialsAvatar
      key={showImageAnyway ? `loaded-${key}` : key}
      name={name}
      size={size}
      title={tooltipTitle}
      imageUrl={showImage ? imageUrl : undefined}
      onImageLoad={() => key && dispatch(setAvatarLoadedSuccess(key))}
      onImageError={() => setImageError(true)}
    />
  );

  const handleLogout = () => {
    dispatch(clearUser());
    setOpen(false);
  };

  const handleSaveNickname = async () => {
    if (!key || nicknameSaving) return;
    const val = nicknameDraft.trim();
    setNicknameSaving(true);
    try {
      const { nickname: saved } = await setNicknameApi(key, val);
      dispatch(setNickname(saved));
      dispatch(
        pushToast({ kind: "success", title: t("avatar.nicknameSaved") }),
      );
    } catch (err: unknown) {
      const msg =
        err &&
        typeof err === "object" &&
        "response" in err &&
        typeof (err as { response?: { data?: { error?: string } } }).response
          ?.data?.error === "string"
          ? (err as { response: { data: { error: string } } }).response.data
              .error
          : t("avatar.nicknameTaken");
      dispatch(setNicknameError(msg));
    } finally {
      setNicknameSaving(false);
    }
  };

  return (
    <AvatarWrap ref={wrapRef} $size={size}>
      {showDropdown ? (
        <div
          role="button"
          tabIndex={0}
          onClick={handleAvatarClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
          style={{
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "block",
            lineHeight: 0,
          }}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={name}
        >
          {avatarContent}
        </div>
      ) : (
        avatarContent
      )}

      {showDropdown && open && (
        <Dropdown
          ref={dropdownRef}
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
          $left={dropdownPosition?.left}
          $top={dropdownPosition?.top}
          $maxHeight={dropdownPosition?.maxHeight}
          $rightEdge={dropdownPosition?.rightEdge}
        >
          <DropdownName>{name}</DropdownName>
          <DropdownEmail>{email}</DropdownEmail>
          {isCurrentUser && (
            <>
              <DropdownActions>
                <DropdownBtn type="button" onClick={handleChangePhoto}>
                  {t("avatar.changePhoto")}
                </DropdownBtn>
                {showImage && (
                  <DropdownBtn type="button" onClick={handleRemovePhoto}>
                    {t("avatar.removePhoto")}
                  </DropdownBtn>
                )}

                {canOpenAdminPanel && (
                  <DropdownBtn
                    type="button"
                    onClick={() => {
                      dispatch(setAdminModalOpen(true));
                      setOpen(false);
                    }}
                  >
                    {t("header.adminPanel")}
                  </DropdownBtn>
                )}
              </DropdownActions>
              <DropdownNicknameRow>
                <NicknameFieldGlobalStyles>
                  <div
                    style={{ fontSize: 12, color: "#4b5563", marginBottom: 6 }}
                  >
                    {t("avatar.nicknameLabel")}
                  </div>
                  <NicknameInputRow>
                    <NicknameFieldWrap>
                      <Field
                        bare
                        type="text"
                        value={nicknameDraft}
                        onChange={(e) =>
                          dispatch(setNicknameDraft(e.target.value))
                        }
                        placeholder={nicknameStub}
                        maxLength={50}
                        error={nicknameError ?? undefined}
                        classNames={nicknameFieldClassNames}
                      />
                    </NicknameFieldWrap>
                    <NicknameSaveBtn
                      type="button"
                      onClick={handleSaveNickname}
                      disabled={nicknameSaving}
                    >
                      {t("avatar.setNickname")}
                    </NicknameSaveBtn>
                  </NicknameInputRow>
                </NicknameFieldGlobalStyles>
              </DropdownNicknameRow>
              <DropdownLogoutRow>
                <LogoutBtn type="button" onClick={handleLogout}>
                  <LogoutIcon aria-hidden />
                  {t("avatar.logout")}
                </LogoutBtn>
              </DropdownLogoutRow>
            </>
          )}
        </Dropdown>
      )}

      {showDropdown && isCurrentUser && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            width: 0,
            height: 0,
          }}
          aria-hidden
        />
      )}
    </AvatarWrap>
  );
}
