import { clientAPI } from "api/clientAPI";
import { clientFetch } from "api/clientFetch";
import { useGenericQuery } from "api/useGenericQuery";
import { blobToFile, readBlobAsDataURL } from "utility/file";

const FILE_LIFETIME = 1000 * 60;

const defaultFileQueryOptions = {
  retry: 0,
  cacheTime: FILE_LIFETIME,
  staleTime: 0,
  // Temporary, while there are component that do not re-mounting through the application lifetime
  // Also, currently it leads to really massive re-fetching on production
  refetchOnWindowFocus: false,
};

const nullFileData = { url: null, file: null };

export const useFileQuery = ({ url, queryKey }, options = {}) => {
  return useGenericQuery(
    { queryKey },
    {
      initialData: nullFileData,
      // The queryFn is overwritten here because fetching file is simpler than API request.
      queryFn: ({ signal }) => {
        return clientAPI.get(url, { signal }).then((data) => {
          if (!data) {
            return Promise.resolve(nullFileData);
          }

          return clientFetch(data.temporary_public_url, options)
            .then((response) => response.blob())
            .then((blob) => {
              const file = blobToFile(blob, data.name || "unknown");

              return readBlobAsDataURL(blob).then((url) => ({ url, file }));
            });
        });
      },

      ...defaultFileQueryOptions,
      ...options,
    }
  );
};
