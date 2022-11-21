//Nextjs 13 login page
'use client';
import { useRouter } from 'next/navigation';
import '../styles/globals.css'
import PocketBase from 'pocketbase';
import { useState } from 'react';

async function login(email: string, password: string): Promise<boolean> {
  const pb = new PocketBase('http://127.0.0.1:8090');
  try{
    const authData = await pb.collection('psychologists').authWithPassword(email, password);
    return true;
  }
    catch(e){
        return false;
        } 
}
async function logout() {
  const pb = new PocketBase('http://127.0.0.1:8090');
  pb.authStore.clear();
}
function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}



export default function loginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (!validateEmail(email)) {
            setError('Please enter a valid email');
            return;
        }
        if (await login(email, password)) {
            router.push('/patients');
        } else {
            setError('Invalid credentials');
        }
    };
    return (
        <div className="flex flex-col justify-center items-center w-screen h-screen">
            <h1>Ingrese sus credenciales</h1>
            <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                <input className="border bg-gray-600" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className="border" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="bg-[#202020] text-white w-full" type="submit">Login</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );

        
}