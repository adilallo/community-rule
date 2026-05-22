"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import Upload from "../../../../components/controls/Upload";
import { useMessages, useTranslation } from "../../../../contexts/MessagesContext";
import { useCreateFlow } from "../../context/CreateFlowContext";
import { CreateFlowHeaderLockup } from "../../components/CreateFlowHeaderLockup";
import { CreateFlowStepShell } from "../../components/CreateFlowStepShell";
import { CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS } from "../../components/createFlowLayoutTokens";
import { fetchAuthSession } from "../../../../../lib/create/api";
import { ASSETS, getAssetPath } from "../../../../../lib/assetUtils";
import {
  UploadToServerError,
  uploadCreateFlowFile,
} from "../../../../../lib/create/uploadToServer";
import {
  clearPendingCommunityAvatarFile,
  storePendingCommunityAvatarFile,
} from "../../../../../lib/create/pendingCommunityAvatarUpload";

/** Create Community — Figma Flow — Upload `20094:41524`. */
export function CommunityUploadScreen() {
  const m = useMessages();
  const u = m.create.community.communityUpload;
  const { markCreateFlowInteraction, state, updateState } = useCreateFlow();
  const tUpload = useTranslation("create.upload");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchAuthSession().then(({ user }) => {
      if (!cancelled) setSignedIn(Boolean(user));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(
    () => () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    },
    [localPreviewUrl],
  );

  const resolveUploadError = useCallback(
    (err: unknown) => {
      if (err instanceof UploadToServerError) {
        if (err.status === 413) return tUpload("errors.tooLarge");
        if (err.status === 401) return tUpload("errors.unauthorized");
        if (err.code === "server_misconfigured") {
          return tUpload("errors.misconfigured");
        }
      }
      return tUpload("errors.generic");
    },
    [tUpload],
  );

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      markCreateFlowInteraction();
      setErrorMessage(null);

      if (signedIn) {
        setBusy(true);
        try {
          const { url } = await uploadCreateFlowFile(file, "communityAvatar");
          setLocalPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
          });
          updateState({ communityAvatarUrl: url });
        } catch (err) {
          setErrorMessage(resolveUploadError(err));
        } finally {
          setBusy(false);
        }
        return;
      }

      if (signedIn === false) {
        try {
          await storePendingCommunityAvatarFile(file);
          setLocalPreviewUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(file);
          });
        } catch {
          setErrorMessage(tUpload("errors.generic"));
        }
      }
    },
    [
      markCreateFlowInteraction,
      resolveUploadError,
      signedIn,
      tUpload,
      updateState,
    ],
  );

  const handleClearPendingUpload = useCallback(() => {
    markCreateFlowInteraction();
    setErrorMessage(null);
    setLocalPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (
      typeof state.communityAvatarUrl === "string" &&
      state.communityAvatarUrl.trim().length > 0
    ) {
      updateState({ communityAvatarUrl: undefined });
    }
    // Clear any anonymous staged blob so the post-sign-in flush won't resurrect it.
    void clearPendingCommunityAvatarFile();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [markCreateFlowInteraction, state.communityAvatarUrl, updateState]);

  const displaySrc =
    typeof state.communityAvatarUrl === "string" &&
    state.communityAvatarUrl.trim().length > 0
      ? state.communityAvatarUrl.trim()
      : localPreviewUrl;
  const hasPreview = typeof displaySrc === "string" && displaySrc.length > 0;

  return (
    <CreateFlowStepShell
      variant="centeredNarrow"
      contentTopBelowMd="space-1400"
    >
      <div
        className={`flex flex-col items-center gap-[18px] ${CREATE_FLOW_MD_UP_COLUMN_MAX_CLASS}`}
      >
        <div className="w-full">
          <CreateFlowHeaderLockup
            title={u.title}
            description={u.description}
            justification="center"
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          tabIndex={-1}
          accept="image/jpeg,image/png,image/webp,image/gif"
          aria-label={u.hintText}
          onChange={handleFileChange}
        />
        <div className="flex w-full flex-col items-center gap-3">
          {hasPreview ? (
            <div className="relative inline-block max-w-full">
              <button
                type="button"
                onClick={handleClearPendingUpload}
                className="absolute right-[8px] top-[8px] z-[1] flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full bg-[var(--color-surface-default-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-invert-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-default-primary)]"
                aria-label={u.clearPendingUploadAriaLabel}
                title={u.clearPendingUploadTooltip}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- matches ModalHeader close control */}
                <img
                  src={getAssetPath(ASSETS.ICON_CLOSE)}
                  alt=""
                  className="h-[16px] w-[16px]"
                  style={{
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element -- user/device file or same-origin upload URL */}
              <img
                src={displaySrc ?? ""}
                alt={u.previewAlt}
                className="max-h-[200px] max-w-full rounded-[var(--measures-radius-200,8px)] object-contain"
              />
            </div>
          ) : (
            <Upload
              active={!busy}
              showHelpIcon={false}
              hintText={busy ? u.uploadingLabel : u.hintText}
              onClick={() => {
                if (!busy) fileInputRef.current?.click();
              }}
            />
          )}
          {signedIn === false ? (
            <p className="max-w-[474px] text-center font-[family-name:var(--font-body)] text-[length:var(--font-size-body-s)] text-[var(--color-content-default-tertiary)]">
              {u.signInToUploadNote}
            </p>
          ) : null}
          {errorMessage ? (
            <p
              className="max-w-[474px] text-center font-[family-name:var(--font-body)] text-[length:var(--font-size-body-s)] text-[var(--color-content-default-secondary)]"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </CreateFlowStepShell>
  );
}
