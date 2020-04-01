import "./Nut.scss";

import { Alert, Button, Icon, message, Modal, Result, Tag, Upload } from "antd";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppStoreContext } from "../../../stores/appStore";
import Loading from "../../Layout/Loading";

function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

const Nut: React.FC<{ visible: boolean }> = observer(({ visible }) => {
  const store = useContext(AppStoreContext);

  const [state, setState] = useState({
    visible,
    loading: false,
    coin: "",
    address: "",
    amount: 0,
    payload: "",
    success: false,
    hash: "",
    scoring: 0,
    name: "",
    imgUrl: "",
    loadImg: false
  });

  useEffect(() => {
    setState({ ...state, visible, coin: store.balance[0]?.coin, imgUrl: "" });
  }, [visible]);

  const { t, i18n } = useTranslation();

  const handleOk = async () => {
    setState({ ...state, loading: true });
    setTimeout(() => {
      setState({ ...state, success: true, loading: false });
    }, 2500);
  };

  const handleCancel = () => {
    setState({ ...state, visible: false, success: false, hash: "" });
  };

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setState({ ...state, loadImg: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) =>
        setState({ ...state, imgUrl: imageUrl, loadImg: false })
      );
    }
  };

  const uploadButton = (
    <div>
      <Icon type={state.loadImg ? "loading" : "plus"} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Modal
      destroyOnClose={true}
      wrapClassName="nut"
      maskClosable={false}
      visible={state.visible}
      title={t("nut.title")}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        !state.success && (
          <>
            <Button key="back" onClick={handleCancel}>
              {t("nut.cancel")}
            </Button>
            <Button
              disabled={state.imgUrl === ""}
              key="submit"
              type="primary"
              loading={state.loading}
              onClick={handleOk}
            >
              {t("ds.send")}
            </Button>
          </>
        )
      }
    >
      {store.balance && !state.success && (
        <>
          <Alert
            style={{ marginBottom: "20px" }}
            type="warning"
            message={t("nut.content1")}
          ></Alert>

          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
            {t("nut.content2")}
          </h3>

          <p style={{ textAlign: "center", marginBottom: "20px" }}>
            {t("nut.yourLevel")} <Tag color="cyan">Начальный</Tag>
          </p>

          <p style={{ textAlign: "center" }}>{t("nut.loadCheck")}</p>

          <div className="send-form">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {state.imgUrl !== "" ? (
                <img
                  src={state.imgUrl}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
        </>
      )}
      {!state.success && !store.balance && <Loading size="50px" />}
      {state.success && (
        <Result
          status="success"
          title={t("nut.success")}
          subTitle={t("nut.success2")}
        />
      )}
    </Modal>
  );
});

export default Nut;
