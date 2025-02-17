import React from 'react'
import { createContext } from 'react'

export const AppContext=createContext();

const AppContextProvider = (props) => {
  const calculateAge=(dob)=>{
    const today=new Date();
    const birthDate=new Date(dob);
    return today.getFullYear()-birthDate.getFullYear();
  }
    const value={calculateAge}
  return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider