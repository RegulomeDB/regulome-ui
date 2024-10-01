/**
 * Utility functions to handle errors.
 */

// lib
import { HTTP_STATUS_CODE } from "./fetch-request";

/**
 * Given an object from data-provider requests containing error information, return an error object
 * expected by the UI. This gets called at the end of most getServerSideProps functions.
 * @param {object} error Retrieved object containing data-provider error information
 * @returns {object} Error object with message and status code, or notFound for 404
 */
export default function errorObjectToProps(errorObject) {
  // NextJS handles 404 separately.
  if (errorObject.code === HTTP_STATUS_CODE.NOT_FOUND) {
    return { notFound: true };
  }

  if (errorObject instanceof Error) {
    return {
      props: {
        serverSideError: {
          "@type": ["InternalServerError", "Error"],
          status: "error",
          code: "INTERNAL_SERVER_ERROR",
          title: errorObject.name || "internal server error",
          description: errorObject.message || "An unknown error occurred.",
          detail: errorObject.stack || "An unknown error occurred.",
        },
      },
    };
  }

  // For all other errors, return an object to get rendered as an error page.
  // serialize the error object to a string
  return {
    props: {
      serverSideError: errorObject,
    },
  };
}
