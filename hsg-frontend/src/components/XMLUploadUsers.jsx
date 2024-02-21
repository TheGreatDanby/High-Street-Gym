import { useRef, useState } from "react";
import { API_URL } from "../api/api";
import { useAuthentication } from "../hooks/authentication";

export function XMLUploadUsers({ onUploadSuccess }) {
  const { jwtToken } = useAuthentication();

  const [statusMessage, setStatusMessage] = useState("");

  const uploadInputRef = useRef(null);

  function uploadFile(e) {
    e.preventDefault();

    const file = uploadInputRef.current.files[0];

    const formData = new FormData();
    formData.append("xml-file", file);

    console.log("File to upload: ", file);
    console.log("FormData: ", formData.get("xml-file"));
    console.log(
      "🚀 ~ file: XMLUpload.jsx:26 ~ uploadFile ~ formData:",
      formData
    );

    fetch(API_URL + "/users/upload/xml", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + jwtToken,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((APIResponse) => {
        setStatusMessage(APIResponse.message);
        uploadInputRef.current.value = null;
        if (typeof onUploadSuccess === "function") {
          onUploadSuccess();
        }
      })
      .catch((error) => {
        setStatusMessage("Upload failed - " + error);
      });
  }

  return (
    <div className="flex justify-center">
      <form
        className="w-full px-4 sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
        onSubmit={uploadFile}
      >
        <div className="form-control ">
          <label className="label ">
            <span className="label-text">XML File Import</span>
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              ref={uploadInputRef}
              type="file"
              className="file-input file-input-bordered file-input-primary w-full text-sm"
            />
            <button className="btn btn-primary whitespace-nowrap">
              Upload
            </button>
          </div>
          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
    </div>
  );
}
