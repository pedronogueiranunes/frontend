import qs from "qs";

/**
 * Pega a URL de um path
 * @param {string} path da URL
 * @returns {string} URL completa do strapi
*/

export function getStrapiURL(path = "") {
    return `${
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
    }${path}`;
  }

  
/**
 *  Helper para fazer GET requests para os endpoints da API do Strapi
 *  @param {string} path para a roda da API
 *  @param {Object} urlParamObjects Objeto de parametros da URL, será stringifado
 *  @param {Object} objeto de options parassado para fetch
 *  @returns Resposta da API call parseada 
*/
export async function fetchAPI(path, urlParamObjects = {}, options = {}) {
    // mescla opções padrão e de usuario
    const mergedOptions = {
        headers: {
            "Content-Type": "application/json",
        }, 
        ...options,
    };


// construindo a URL de request
const queryString = qs.stringify(urlParamObjects);
const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
)}`;


// fazendo API Call
const response = await fetch(requestURL, mergedOptions);

// lidando com a response
if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`Ocorreu um erro, por favor tente novamente`);
}
const data = await response.json();
return data;

};