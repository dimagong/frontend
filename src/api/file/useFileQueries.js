import { clientAPI } from "api/clientAPI";
import { clientFetch } from "api/clientFetch";
import { useGenericQuery } from "api/useGenericQuery";
import { promisifiedReadAsDataURL } from "utility/file";

const FILE_LIFETIME = 1000 * 60;

const defaultFileQueryOptions = {
  retry: 0,
  cacheTime: FILE_LIFETIME,
  staleTime: 0,
  // Temporary, while there are component that do not re-mounting through the application lifetime
  // Also, currently it leads to really massive re-fetching on production
  refetchOnWindowFocus: false,
};

const fetchFileAsDataURL = (fileUrl, options) => {
  if (!fileUrl) {
    return Promise.resolve(null);
  }

  return clientFetch(fileUrl, options)
    .then((response) => response.blob())
    .then(promisifiedReadAsDataURL);
};

export const useFileQuery = ({ url, queryKey }, options = {}) => {
  return useGenericQuery(
    { queryKey },
    {
      initialData: { url: null },
      // The queryFn is overwritten here because fetching file is simpler than API request.
      queryFn: ({ signal }) => {
        return clientAPI
          .get(url, { signal })
          .then((fileUrl) => fetchFileAsDataURL(fileUrl, { signal }))
          .then((url) => ({ url }));
      },

      ...defaultFileQueryOptions,
      ...options,
    }
  );
};
