// // hooks/useAuth.ts
// import { useState, useEffect } from 'react';
// import { auth } from "@/app/helpers/auth";

// export const useAuth = () => {
//     const [data, setData] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchAuthData = async () => {
//             try {
//                 const authData = await auth();
//                 setData(authData);
//             } catch (err) {
//                 setError((err as Error).message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAuthData();
//     }, []);

//     return { data, loading, error };
// };
