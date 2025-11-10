import React, { useEffect, useRef, useState } from 'react';
import AuthWrapper from '../components/AuthWrapper';
import Login from '../components/Login';
import Cadastro from '../components/Cadastro';

export default function AuthPage(){
  return <AuthWrapper LoginComp={Login} RegisterComp={Cadastro} showByDefault="login" />;
}
