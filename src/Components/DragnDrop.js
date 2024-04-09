import React, { useCallback, useState, useEffect, useRef, Fragment } from 'react'
import AWS from 'aws-sdk';

const DragnDrop = () => {
    AWS.config.update({
        region: "ap-northeast-2",
        accessKeyId: process.env.REACT_APP_S3_ACCESSKEY,
        secretAccessKey: process.env.REACT_APP_S3_SECRETKEY,
    });

    const uploadToS3 = async (file, filePath) => {
        const upload = new AWS.S3.ManagedUpload({
            params: {
                Bucket: "seumu-s3-bucket", // 버킷 이름
                Key: filePath, // 파일 이름
                Body: file, // 파일 객체
            },
        });

        const promise = upload.promise();

        promise.then((data) => {
            console.log(data);
            //setImageURL(data.Location);
        });
    };

    const [fileList, setFileList] = useState([]);
    const [totalTag, setTotalTag] = useState();

    const traverseFileTree = (item, path = "") => {
        if (item.isFile) {
            // 파일인 경우 처리
            item.file(function (file) {
                const fullPath = path + file.name;
                console.log("Uploading:", fullPath);
                uploadToS3(file, fullPath); // S3로 파일 업로드
            });
        } else if (item.isDirectory) {
            // 디렉토리인 경우 내부 탐색
            const dirReader = item.createReader();

            dirReader.readEntries((entries) => {
                entries.forEach((entry) => {
                    traverseFileTree(entry, path + item.name + "/");
                });
            });
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();

        let items = event.dataTransfer.items;

        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();

            if (item) {
                traverseFileTree(item);
            }
        }
    };

    return (
        <div>
            <div
                id="dropzone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ border: "1px solid black", padding: "20px" }}
            >
                Drop files here
            </div>
        </div>
    );
}

export default DragnDrop;