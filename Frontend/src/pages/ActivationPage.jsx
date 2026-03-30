import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from "../api/axios";



const ActivationPage = () => {
    const { activationToken } = useParams();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (activationToken) {
            const activationEmail = async () => {
                try {
                    const res = await api.post(`/auth/activation`, {
                            activationToken
                        })
                    console.log(res.data.message);
                } catch (err) {
                    console.log(err.response.data.message);
                    setError(true);
                }
            }
            activationEmail();
        }

    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            {
                error ? (
                    <p className='text-red-800'>Your token is expired or invalid!</p>
                ) : (
                    <p className='text-green-800'>Your Account has been created successfully!</p>
                )
            }

        </div>
    )
}

export default ActivationPage