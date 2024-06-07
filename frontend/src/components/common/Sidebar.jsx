import BubbleSvg from "../svgs/Bubble.jsx";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-300 bg-white'>
				<Link to='/' className='flex justify-center md:justify-start p-4'>
					<BubbleSvg className='w-12 h-12 text-blue-500' />
				</Link>
				<ul className='flex flex-col gap-3 mt-6'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-3 pl-4 pr-6 w-full'
						>
							<MdHomeFilled className='w-6 h-6 text-gray-700' />
							<span className='text-lg hidden md:block text-gray-700'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-3 pl-4 pr-6 w-full'
						>
							<IoNotifications className='w-6 h-6 text-gray-700' />
							<span className='text-lg hidden md:block text-gray-700'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-3 pl-4 pr-6 w-full'
						>
							<FaUser className='w-6 h-6 text-gray-700' />
							<span className='text-lg hidden md:block text-gray-700'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<div className='mt-auto mb-10 p-4'>
						<Link
							to={`/profile/${authUser.username}`}
							className='flex items-center gap-3 transition-all duration-300 hover:bg-gray-200 p-3 rounded-full'
						>
							<div className='avatar'>
								<div className='w-10 h-10 rounded-full'>
									<img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
								</div>
							</div>
							<div className='flex-1'>
								<p className='text-gray-900 font-semibold'>{authUser?.fullName}</p>
								<p className='text-gray-500 text-sm'>@{authUser?.username}</p>
							</div>
							<BiLogOut
								className='w-6 h-6 text-gray-700 cursor-pointer hover:text-red-600'
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
