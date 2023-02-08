import React, { useState } from "react";

const VCardUpload = () => {
  const [file, setFile] = useState(null);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !file.name || !file.name.endsWith('.vcf')) {
        window.alert('Error: Only .vcf files are allowed.');
        return;
    }
    const formData = new FormData();
    formData.append("file", file);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
      window.location.reload()
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default VCardUpload;
