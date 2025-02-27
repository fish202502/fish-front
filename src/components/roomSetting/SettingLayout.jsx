import React from "react";
import Setting from "./Setting";
import ShowUrl from "../room/ShowUrl";
import styles from "./SettingLayout.module.scss"
const SettingLayout = () => {
  return (
    <div className={styles.SettingFrame}>
      <Setting />
      <ShowUrl />
    </div>
  );
};

export default SettingLayout;
