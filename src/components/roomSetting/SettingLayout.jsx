import React from "react";
import Setting from "./Setting";
import ShowUrl from "../room/ShowUrl";
import styles from "./SettingLayout.module.scss"
const SettingLayout = () => {
  return (
    <div className={styles.FullSettingFrame}>
    <div className={styles.SettingFrame}>
      <h2>⚙️Setting</h2>
      <div className={styles.whiteContainer}>
      <Setting />
      <ShowUrl />
      </div>
    </div>


    </div>
  );
};

export default SettingLayout;
