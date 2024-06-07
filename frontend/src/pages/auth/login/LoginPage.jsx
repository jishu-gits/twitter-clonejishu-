import { useState } from "react";
import { Link } from "react-router-dom";

import BubbleSvg from "../../../components/svgs/Bubble";

import { MdOutlineMail, MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient = useQueryClient();

	const loginMutation = useMutation({
		mutationFn: async ({ username, password }) => {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ username, password }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}

			// Store the token
			localStorage.setItem("authToken", data.token);

			return data;
		},
		onSuccess: () => {
			// refetch the authUser
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: (error) => {
			console.error("Login failed: ", error.message);
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation.mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const { isPending, isError, error } = loginMutation;

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
			<div className='bg-white shadow-lg rounded-lg p-8 max-w-md w-full'>
				<div className='flex justify-center mb-6'>
					<BubbleSvg className='w-16 h-16 text-blue-500' />
				</div>
				<h1 className='text-2xl font-semibold text-center text-gray-700 mb-4'>Log In</h1>
				<form className='space-y-6' onSubmit={handleSubmit}>
					<div className='flex flex-col'>
						<label className='flex items-center gap-2 mb-2'>
							<MdOutlineMail className='text-gray-400' />
							<input
								type='text'
								className='border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
					</div>

					<div className='flex flex-col'>
						<label className='flex items-center gap-2 mb-2'>
							<MdPassword className='text-gray-400' />
							<input
								type='password'
								className='border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
								placeholder='Password'
								name='password'
								onChange={handleInputChange}
								value={formData.password}
							/>
						</label>
					</div>
					<button
						type='submit'
						className='w-full bg-blue-500 text-white rounded-md py-3 hover:bg-blue-600 transition duration-300'
					>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='text-red-500 text-center mt-2'>{error?.message}</p>}
				</form>
				<div className='flex flex-col items-center gap-2 mt-6'>
					<p className='text-gray-600'>Don't have an account?</p>
					<Link to='/signup' className='text-blue-500 hover:underline'>
						Sign up Now
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
