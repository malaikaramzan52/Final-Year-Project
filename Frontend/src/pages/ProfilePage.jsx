import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../components/Layout/Header'
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
const ProfilePage = () => {
      const [active, setActive] = useState(1);
  const { user } = useSelector((state) => state.user);
  return (
    // <div>Allah</div>
    <div>
      <Header/>
      <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
        <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%]">
          <ProfileSideBar active={active} setActive={setActive}/>
        </div>
           <ProfileContent active={active} user={user} />
      </div>
    </div>
  )
}

export default ProfilePage