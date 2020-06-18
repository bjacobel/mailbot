export const IS_PROD = process.env.NODE_ENV === "production";

const HEADER_BASE = "x-amz-meta";

export const HEADER = {
  KEY: `${HEADER_BASE}-x-amz-key-v2`,
  IV: `${HEADER_BASE}-x-amz-iv`,
  ALGO: `${HEADER_BASE}-x-amz-cek-alg`,
  MATSEC: `${HEADER_BASE}-x-amz-matdesc`,
  CONTENT_LEN: `${HEADER_BASE}-x-amz-unencrypted-content-length`,
  TAG_LEN: `${HEADER_BASE}-x-amz-tag-len`,
};
