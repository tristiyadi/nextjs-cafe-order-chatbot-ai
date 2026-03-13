/* eslint-disable @typescript-eslint/no-explicit-any */
import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";

export const qdrant = new QdrantClient({ url: qdrantUrl });

export const COLLECTION_NAME = "menu_items";

// Get dimension from env (used by ensureCollection)
function getVectorDimension() {
  const type = (process.env.EMBEDDING_TYPE || "multilingual-e5").toLowerCase();
  if (type === "bge-m3" || type === "bgm-3") return 1024;
  return 384; // Default to multilingual-e5
}

export async function ensureCollection() {
  const collections = await qdrant.getCollections();
  const exists = collections.collections.some(
    (c) => c.name === COLLECTION_NAME,
  );

  const dimension = getVectorDimension();

  if (!exists) {
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: dimension,
        distance: "Cosine",
      },
    });
    console.log(`Created collection: ${COLLECTION_NAME} with dimension ${dimension}`);
  } else {
    // Check if the existing dimension matches
    try {
      const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);
      const currentSize = (collectionInfo?.config?.params?.vectors as any)?.size;
      
      if (currentSize !== dimension) {
        console.warn(`Dimension mismatch! Current: ${currentSize}, Config: ${dimension}. Re-creating collection...`);
        await qdrant.deleteCollection(COLLECTION_NAME);
        await qdrant.createCollection(COLLECTION_NAME, {
          vectors: {
            size: dimension,
            distance: "Cosine",
          },
        });
      }
    } catch (e) {
      console.warn("Failed to check collection dimension, sticking with current version.", e);
    }
  }
}

export async function upsertMenuItemVector(
  id: string,
  vector: number[],
  payload: Record<string, any>,
) {
  return qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: [
      {
        id: id, // Qdrant expects UUID-like or integer, but string also works depending on format
        vector: vector,
        payload: payload,
      },
    ],
  });
}

export async function searchSimilarMenu(vector: number[], limit: number = 5) {
  return qdrant.search(COLLECTION_NAME, {
    vector: vector,
    limit: limit,
    with_payload: true,
  });
}
