import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearUser, setAdminModalOpen, setUser } from "@/features/auth/model";
import { Modal } from "@/components/atoms/Modal";
import { Button } from "@/components/atoms/Button";
import { Field } from "@/components/atoms/Field";
import { Spinner } from "@/components/atoms/Spinner";
import { useT } from "@/features/i18n";
import { isValidEmail } from "@/shared/utils/validators";
import {
  deleteUserAndTasks,
  getMe,
  searchUsersForAdmin,
  updateAdmins,
  type AdminUserInfo,
} from "@/shared/api/authApi";
import { pushToast } from "@/features/notifications/model/notificationsSlice";
import {
  ModalHeader,
  HeaderLeft,
  HeaderBadge,
  HeaderText,
  ModalTitle,
  ModalSubtitle,
  CloseBtn,
  FormBody,
  FormGroup,
  Label,
  Divider,
} from "../AuthModal/AuthModal.styled";
import { Pill } from "@/components/atoms/Pill";

const TableWrap = styled.div`
  margin: 12px 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 10px;
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 10px 10px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
`;

const EmailCell = styled.div`
  max-width: 14rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SmallControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const CheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #374151;
  user-select: none;

  input {
    width: 14px;
    height: 14px;
  }
`;

const Select = styled.select`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #111827;
  background: white;
  min-width: 6rem;
  cursor: pointer;
`;

const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const SpinnerCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
`;

export function AdminModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((s) => s.auth.adminModalOpen);
  const currentUser = useAppSelector((s) => s.auth.user);
  const t = useT();

  const roleStr = (currentUser?.role ?? "").toString().toLowerCase().trim();
  const isSuperAdmin =
    roleStr === "super-admin" ||
    roleStr === "superadmin" ||
    roleStr === "super_admin" ||
    roleStr === "super admin";
  const isAdmin = roleStr === "admin";

  const [emailQuery, setEmailQuery] = useState("");
  const [adminsOnly, setAdminsOnly] = useState(false);
  const [pageSize, setPageSize] = useState(20);

  const [users, setUsers] = useState<AdminUserInfo[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const canRender = isOpen && Boolean(currentUser) && (isAdmin || isSuperAdmin);

  const close = () => dispatch(setAdminModalOpen(false));

  const refreshCurrentUser = () => {
    if (!currentUser) return;
    getMe(currentUser.email, currentUser.name)
      .then((me) => dispatch(setUser(me)))
      .catch(() => {});
  };

  const normalizeAndValidateQuery = (): string | null => {
    const q = emailQuery.trim();
    if (!q) return "";

    // If user pasted comma-separated list, validate each email token.
    if (q.includes(",")) {
      const parts = q
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length === 0) return "";
      for (const p of parts) {
        if (!isValidEmail(p)) return null;
      }
    }
    return q;
  };

  const loadUsers = async () => {
    if (!currentUser) return;
    setLoadingUsers(true);
    setError(null);

    try {
      const q = normalizeAndValidateQuery();
      if (q === null) {
        setError(t("admin.emailInvalid"));
        return;
      }

      const result = await searchUsersForAdmin({
        emailQuery: q,
        adminsOnly,
        limit: pageSize,
      });
      setUsers(result.users);
      setSelectedEmails(new Set());
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : t("admin.errorGeneric");
      setError(msg);
      dispatch(pushToast({ kind: "error", title: msg }));
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (!currentUser) return;
    if (!isAdmin && !isSuperAdmin) return;
    setError(null);
    setUsers([]);
    setSelectedEmails(new Set());
    void loadUsers();
    // Intentionally depends only on modal visibility/current user identity.
    // We want a fresh fetch each time the admin panel opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentUser?.email]);

  const selectedUsers = users.filter((u) => selectedEmails.has(u.email));
  const selectedCount = selectedEmails.size;

  if (!canRender) return null;

  const toggleSelected = (email: string) => {
    setSelectedEmails((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedEmails((prev) => {
      const onPageEmails = users.map((u) => u.email);
      const allSelected =
        onPageEmails.length > 0 && onPageEmails.every((e) => prev.has(e));
      return allSelected ? new Set() : new Set(onPageEmails);
    });
  };

  const bulkMakeAdmin = async () => {
    if (!currentUser) return;
    if (!isSuperAdmin) return;
    if (selectedCount === 0) return;

    const targets = selectedUsers.filter((u) => u.role !== "super-admin");
    if (targets.length === 0) {
      const msg = t("admin.bulkNoTargets");
      setError(msg);
      dispatch(pushToast({ kind: "warning", title: msg }));
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        targets.map((u) => updateAdmins(currentUser.email, u.email, "add")),
      );

      const rejected = results.filter((r) => r.status === "rejected").length;
      if (rejected > 0) {
        dispatch(
          pushToast({
            kind: "warning",
            title: t("admin.bulkPartialError"),
          }),
        );
      } else {
        dispatch(pushToast({ kind: "success", title: t("admin.bulkSuccess") }));
      }

      const includesMe = targets.some(
        (u) => u.email.toLowerCase() === currentUser.email.toLowerCase(),
      );
      if (includesMe) refreshCurrentUser();
      await loadUsers();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : t("admin.errorGeneric");
      setError(msg);
      dispatch(pushToast({ kind: "error", title: msg }));
    } finally {
      setBusy(false);
    }
  };

  const bulkRevokeAdmin = async () => {
    if (!currentUser) return;
    if (!isSuperAdmin) return;
    if (selectedCount === 0) return;

    const targets = selectedUsers.filter((u) => u.role !== "super-admin");
    if (targets.length === 0) {
      const msg = t("admin.bulkNoTargets");
      setError(msg);
      dispatch(pushToast({ kind: "warning", title: msg }));
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const results = await Promise.allSettled(
        targets.map((u) => updateAdmins(currentUser.email, u.email, "remove")),
      );

      const rejected = results.filter((r) => r.status === "rejected").length;
      if (rejected > 0) {
        dispatch(
          pushToast({ kind: "warning", title: t("admin.bulkPartialError") }),
        );
      } else {
        dispatch(pushToast({ kind: "success", title: t("admin.bulkSuccess") }));
      }

      const includesMe = targets.some(
        (u) => u.email.toLowerCase() === currentUser.email.toLowerCase(),
      );
      if (includesMe) refreshCurrentUser();
      await loadUsers();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : t("admin.errorGeneric");
      setError(msg);
      dispatch(pushToast({ kind: "error", title: msg }));
    } finally {
      setBusy(false);
    }
  };

  const bulkDeleteUsers = async () => {
    if (!currentUser) return;
    if (selectedCount === 0) return;

    if (!isSuperAdmin) {
      const hasSuperAdmins = selectedUsers.some(
        (u) => u.role === "super-admin",
      );
      if (hasSuperAdmins) {
        const msg = t("admin.cannotDeleteSuperAdminBulk");
        setError(msg);
        dispatch(pushToast({ kind: "error", title: msg }));
        return;
      }
    }

    if (!window.confirm(t("admin.deleteSelectedConfirm"))) return;

    setBusy(true);
    setError(null);
    try {
      const targets = selectedUsers.map((u) => u.email);
      const results = await Promise.allSettled(
        targets.map((email) => deleteUserAndTasks(email)),
      );

      const rejected = results.filter((r) => r.status === "rejected").length;
      if (rejected > 0) {
        dispatch(
          pushToast({ kind: "warning", title: t("admin.bulkPartialError") }),
        );
      } else {
        dispatch(
          pushToast({ kind: "success", title: t("admin.bulkDeleteSuccess") }),
        );
      }

      const includesMe = targets.some(
        (email) => email.toLowerCase() === currentUser.email.toLowerCase(),
      );
      if (includesMe) {
        dispatch(clearUser());
        close();
        return;
      }

      refreshCurrentUser();
      await loadUsers();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : t("admin.errorGeneric");
      setError(msg);
      dispatch(pushToast({ kind: "error", title: msg }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal onClose={close} maxWidth="34rem" scroll>
      <ModalHeader>
        <HeaderLeft>
          <HeaderBadge aria-hidden>
            <img
              src="/assets/images/icon/filter-white.svg"
              alt=""
              aria-hidden
            />
          </HeaderBadge>
          <HeaderText>
            <ModalTitle>{t("admin.title")}</ModalTitle>
            <ModalSubtitle>
              {isSuperAdmin ? t("admin.subtitle") : t("admin.subtitleAdmin")}
            </ModalSubtitle>
          </HeaderText>
        </HeaderLeft>
        <CloseBtn aria-label={t("common.close")} onClick={close}>
          ×
        </CloseBtn>
      </ModalHeader>

      <FormBody
        style={{
          position: "relative",
          height: "100%",
          minHeight: 0,
        }}
      >
        <Label>{t("admin.userEmail")}</Label>
        <SearchRow style={{ alignItems: "stretch" }}>
          <SearchColumn>
            <FormGroup style={{ marginBottom: 0 }}>
              <Field
                type="text"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder={t("admin.emailPlaceholder")}
                error={error ?? undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void loadUsers();
                }}
              />
            </FormGroup>
          </SearchColumn>

          <ControlRow style={{ justifyContent: "flex-end", flex: "0 0 auto" }}>
            <Button
              type="button"
              onClick={() => void loadUsers()}
              disabled={busy}
              loading={loadingUsers}
              style={{
                width: "fit-content",
                height: "100%",
                background: "#f97316",
                color: "#fff",
                border: "none",
              }}
            >
              {t("admin.loadUsers")}
            </Button>
          </ControlRow>
        </SearchRow>

        <SmallControlsRow>
          <CheckboxRow>
            <input
              type="checkbox"
              checked={adminsOnly}
              onChange={(e) => setAdminsOnly(e.target.checked)}
              disabled={busy || loadingUsers}
            />
            {t("admin.onlyAdmins")}
          </CheckboxRow>

          <ControlRow style={{ flex: "0 0 auto" }}>
            <Label style={{ margin: 0, fontSize: 12 }}>
              {t("admin.pageSize")}
            </Label>
            <Select
              value={String(pageSize)}
              onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
              disabled={busy || loadingUsers}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </Select>
          </ControlRow>
        </SmallControlsRow>

        {loadingUsers && users.length === 0 ? (
          <SpinnerCenter>
            <Spinner />
          </SpinnerCenter>
        ) : null}

        {users.length > 0 && (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: "40px" }}>
                    <input
                      type="checkbox"
                      checked={
                        users.length > 0 &&
                        users.every((u) => selectedEmails.has(u.email))
                      }
                      onChange={() => handleSelectAll()}
                      disabled={busy}
                      aria-label={t("admin.selectAll")}
                    />
                  </Th>
                  <Th>{t("admin.userEmail")}</Th>
                  <Th>{t("admin.nickname")}</Th>
                  <Th style={{ width: "92px" }}>{t("admin.role")}</Th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const checked = selectedEmails.has(u.email);
                  const roleLabel =
                    u.role === "super-admin"
                      ? "Super-admin"
                      : u.role === "admin"
                        ? "Admin"
                        : "User";
                  return (
                    <tr
                      key={u.email}
                      style={{
                        background: checked ? "#fff7ed" : "transparent",
                      }}
                    >
                      <Td>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelected(u.email)}
                          disabled={busy}
                          aria-label={`${t("admin.select")} ${u.email}`}
                        />
                      </Td>
                      <Td>
                        <EmailCell title={u.email}>{u.email}</EmailCell>
                      </Td>
                      <Td>{u.nickname}</Td>
                      <Td>
                        <Pill>{roleLabel}</Pill>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrap>
        )}

        {users.length === 0 && !loadingUsers ? (
          <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
            {t("admin.noUsersFound")}
          </div>
        ) : null}

        {selectedCount > 0 && (
          <div style={{ marginTop: 12, fontSize: 12, color: "#374151" }}>
            {t("admin.selectedCount", { count: selectedCount })}
          </div>
        )}

        {isSuperAdmin && (
          <>
            <Button
              type="button"
              onClick={() => void bulkMakeAdmin()}
              disabled={busy || selectedCount === 0}
              style={{
                width: "100%",
                background: "#f97316",
                color: "#fff",
                border: "none",
              }}
            >
              {t("admin.makeSelectedAdmins")}
            </Button>

            <Divider>{t("auth.dividerOr")}</Divider>
            <Button
              type="button"
              onClick={() => void bulkRevokeAdmin()}
              style={{
                width: "100%",
                background: "#111827",
                color: "#fff",
                border: "none",
              }}
              disabled={busy || selectedCount === 0}
            >
              {t("admin.revokeSelectedAdmins")}
            </Button>

            <Divider>{t("auth.dividerOr")}</Divider>
          </>
        )}

        <Button
          type="button"
          onClick={() => void bulkDeleteUsers()}
          style={{
            width: "100%",
            background: "#dc2626",
            color: "#fff",
            border: "none",
          }}
          disabled={busy || selectedCount === 0}
        >
          {t("admin.deleteSelectedUsers")}
        </Button>
      </FormBody>
    </Modal>
  );
}
