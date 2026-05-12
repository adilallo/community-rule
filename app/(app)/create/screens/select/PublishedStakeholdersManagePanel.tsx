"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "../../../../components/buttons/Button";
import TextInput from "../../../../components/controls/TextInput";
import { useTranslation } from "../../../../contexts/MessagesContext";
import {
  addRuleStakeholder,
  deleteRuleStakeholder,
  fetchRuleStakeholders,
  resendRuleStakeholderInvite,
  type RuleStakeholderListItem,
} from "../../../../../lib/create/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PublishedStakeholdersManagePanel({
  ruleId,
}: {
  ruleId: string;
}) {
  const t = useTranslation("create.reviewAndComplete.confirmStakeholders");
  const [items, setItems] = useState<RuleStakeholderListItem[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(false);
    const list = await fetchRuleStakeholders(ruleId);
    if (list === null) {
      setLoadError(true);
      setItems([]);
      return;
    }
    setItems(list);
  }, [ruleId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAdd = async () => {
    setBannerError("");
    setFieldError("");
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setFieldError(t("managePublished.invalidEmail"));
      return;
    }
    setAddBusy(true);
    const res = await addRuleStakeholder(ruleId, trimmed);
    setAddBusy(false);
    if (res.ok === true) {
      setEmail("");
      void load();
      return;
    }
    if (res.retryAfterMs != null && res.retryAfterMs > 0) {
      const seconds = Math.ceil(res.retryAfterMs / 1000);
      setBannerError(
        t("managePublished.rateLimited").replace("{seconds}", String(seconds)),
      );
      return;
    }
    setBannerError(
      res.error.trim() !== "" ? res.error : t("managePublished.actionFailed"),
    );
  };

  const handleRemove = async (id: string) => {
    setBannerError("");
    setBusyId(id);
    const res = await deleteRuleStakeholder(ruleId, id);
    setBusyId(null);
    if (res.ok === true) {
      void load();
      return;
    }
    setBannerError(
      res.error.trim() !== "" ? res.error : t("managePublished.actionFailed"),
    );
  };

  const handleResend = async (id: string) => {
    setBannerError("");
    setBusyId(id);
    const res = await resendRuleStakeholderInvite(ruleId, id);
    setBusyId(null);
    if (res.ok === true) {
      return;
    }
    if (res.retryAfterMs != null && res.retryAfterMs > 0) {
      const seconds = Math.ceil(res.retryAfterMs / 1000);
      setBannerError(
        t("managePublished.rateLimited").replace("{seconds}", String(seconds)),
      );
      return;
    }
    setBannerError(
      res.error.trim() !== "" ? res.error : t("managePublished.actionFailed"),
    );
  };

  return (
    <section className="flex w-full flex-col gap-4 pt-1 pb-2">
      {bannerError ? (
        <p
          className="font-inter text-sm text-[var(--color-border-default-utility-negative)]"
          role="alert"
        >
          {bannerError}
        </p>
      ) : null}

      {loadError ? (
        <p className="font-inter text-sm text-[var(--color-border-default-utility-negative)]">
          {t("managePublished.loadFailed")}
        </p>
      ) : items === null ? (
        <p className="font-inter text-sm text-[var(--color-content-default-secondary)]">
          {t("managePublished.loading")}
        </p>
      ) : items.length === 0 ? (
        <p className="font-inter text-sm text-[var(--color-content-default-tertiary)]">
          {t("managePublished.empty")}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-2 rounded-lg bg-black/5 px-3 py-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate font-inter text-sm font-medium text-[var(--color-content-default-primary)] md:text-base">
                  {row.email}
                </span>
                <span className="font-inter text-xs text-[var(--color-content-default-tertiary)] md:text-sm">
                  {row.status === "pending"
                    ? t("managePublished.pending")
                    : t("managePublished.accepted")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {row.status === "pending" ? (
                  <Button
                    type="button"
                    size="small"
                    buttonType="outline"
                    palette="default"
                    disabled={busyId === row.id}
                    onClick={() => void handleResend(row.id)}
                    ariaLabel={t("managePublished.resendAria").replace(
                      "{email}",
                      row.email,
                    )}
                  >
                    {t("managePublished.resend")}
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="small"
                  buttonType="outline"
                  palette="default"
                  disabled={busyId === row.id}
                  onClick={() => void handleRemove(row.id)}
                  ariaLabel={t("managePublished.removeAria").replace(
                    "{email}",
                    row.email,
                  )}
                >
                  {t("managePublished.remove")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-3">
        <div className="min-w-0 flex-1">
          <TextInput
            id="published-stakeholder-email"
            type="email"
            inputSize="small"
            showHelpIcon={false}
            label={t("managePublished.emailLabel")}
            placeholder={t("managePublished.emailPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldError("");
            }}
            error={Boolean(fieldError)}
            textHint={fieldError || false}
            autoComplete="email"
          />
        </div>
        <Button
          type="button"
          size="small"
          buttonType="filled"
          palette="default"
          className="md:mb-[2px]"
          disabled={addBusy || items === null}
          onClick={() => void handleAdd()}
        >
          {t("managePublished.addInvite")}
        </Button>
      </div>
    </section>
  );
}
