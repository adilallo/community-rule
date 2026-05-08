/** Multipart field `purpose` for `POST /api/uploads` — keep in sync with server validation. */
export const CREATE_FLOW_UPLOAD_PURPOSES = [
  "communityAvatar",
  "customMethodAttachment",
] as const;

export type CreateFlowUploadPurpose =
  (typeof CREATE_FLOW_UPLOAD_PURPOSES)[number];
