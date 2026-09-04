import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from "chart.js/auto";
import { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourse, getAllCourses } from "../../Redux/Slices/CourseSlice";
import { getPaymentRecords } from "../../Redux/Slices/RazorpaySlice";
import { getStatData } from "../../Redux/Slices/StatSlice";

ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title
);
function AdminDashboard() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { allUserCount, subscribedCount } = useSelector(
		(state) => state.stat
	);

	const { allPayments, monthlySalesRecords } = useSelector(
		(state) => state.razorpay
	);

	const userData = {
		labels: ["Registered Users", "Enrolled Users"],
		datasets: [
			{
				label: "User Details",
				backgroundColor: ["yellow", "green"],
				data: [allUserCount, subscribedCount],
				borderWidth: 1,
			},
		],
	};

	const myCourses = useSelector((state) => state?.course?.courseData);

	async function onCourseDelete(id) {
		if(window.confirm("Are you sure you want to delete this course?") === false) return;
		const res = await dispatch(deleteCourse(id));
		if (res?.payload?.success) {
			await dispatch(getAllCourses());
		}
	}

	const salesData = {
		labels: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
		fontColor: "white",
		datasets: [
			{
				label: "Sales/Month",
				backgroundColor: "red",
				data: monthlySalesRecords || [],
				borderWidth: 2,
				borderColor: "white",
			},
		],
	};

	useEffect(() => {
		(async () => {
			await dispatch(getAllCourses());
			await dispatch(getStatData());
			await dispatch(getPaymentRecords());
		})();
	}, [dispatch]);

	return (
		<HomeLayout>
			<div className="min-h-[90vh] flex flex-col pt-5 gap-10 text-white max-w-7xl mx-auto px-4 sm:px-8 w-full">
				<h1 className="text-center text-3xl sm:text-5xl font-semibold text-yellow-500">
					ADMIN DASHBOARD
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
					<div className="flex flex-col items-center gap-6 p-4 sm:p-5 shadow-lg rounded-md bg-gray-800/40 border border-gray-700">
						<div className="w-full max-w-[280px] sm:max-w-xs h-64 sm:h-80 flex items-center justify-center">
							<Pie data={userData} />
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
							<div className="flex items-center justify-between p-4 rounded-md shadow-md gap-3 bg-gray-800/60 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50">
								<div className="flex flex-col items-start">
									<p className="font-semibold text-sm sm:text-base text-gray-300">
										Registered Users
									</p>
									<h3 className="text-2xl sm:text-4xl font-bold">
										{allUserCount}
									</h3>
								</div>
								<FaUsers className="text-yellow-500 text-3xl sm:text-5xl" />
							</div>
							<div className="flex items-center justify-between p-4 rounded-md shadow-md gap-3 bg-gray-800/60 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50">
								<div className="flex flex-col items-start">
									<p className="font-semibold text-sm sm:text-base text-gray-300">
										Enrolled Users
									</p>
									<h3 className="text-2xl sm:text-4xl font-bold">
										{subscribedCount}
									</h3>
								</div>
								<FaUsers className="text-green-500 text-3xl sm:text-5xl" />
							</div>
						</div>
					</div>

					<div className="flex flex-col items-center gap-6 p-4 sm:p-5 shadow-lg rounded-md bg-gray-800/40 border border-gray-700">
						<div className="h-64 sm:h-80 w-full relative">
							<Bar
								className="absolute bottom-0 h-full w-full"
								data={salesData}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
							<div className="flex items-center justify-between p-4 rounded-md shadow-md gap-3 bg-gray-800/60 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50">
								<div className="flex flex-col items-start">
									<p className="font-semibold text-sm sm:text-base text-gray-300">
										Subscription Count
									</p>
									<h3 className="text-2xl sm:text-4xl font-bold">
										{allPayments?.count || 0}
									</h3>
								</div>
								<FcSalesPerformance className="text-yellow-500 text-3xl sm:text-5xl" />
							</div>
							<div className="flex items-center justify-between p-4 rounded-md shadow-md gap-3 bg-gray-800/60 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50">
								<div className="flex flex-col items-start">
									<p className="font-semibold text-sm sm:text-base text-gray-300">
										Total Revenue
									</p>
									<h3 className="text-2xl sm:text-4xl font-bold">
										{(allPayments?.count || 0) * 499}
									</h3>
								</div>
								<GiMoneyStack className="text-green-500 text-3xl sm:text-5xl" />
							</div>
						</div>
					</div>
				</div>

				<div className="w-full flex flex-col items-center justify-center gap-6 mb-10">
					<div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4">
						<h1 className="text-center text-2xl sm:text-3xl font-semibold">
							Courses overview
						</h1>

						<button
							onClick={() => navigate("/course/create")}
							className="w-full sm:w-fit bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded py-2 px-4 font-semibold text-base sm:text-lg cursor-pointer">
							Create New Course
						</button>
					</div>

					<div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-700">
						<table className="table w-full text-left">
							<thead className="bg-gray-800 text-gray-200">
								<tr>
									<th className="px-4 py-3">S No</th>
									<th className="px-4 py-3">Course Title</th>
									<th className="px-4 py-3">Course Category</th>
									<th className="px-4 py-3">Instructor</th>
									<th className="px-4 py-3">Total Lectures</th>
									<th className="px-4 py-3">Description</th>
									<th className="px-4 py-3 text-center">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{myCourses?.map((course, index) => (
									<tr key={course._id} className="hover:bg-gray-800/50">
										<td className="px-4 py-3">{index + 1}</td>
										<td className="px-4 py-3">
											<div className="w-36 sm:w-40 break-words">
												{course?.title}
											</div>
										</td>
										<td className="px-4 py-3">{course?.category}</td>
										<td className="px-4 py-3">{course?.createdBy}</td>
										<td className="px-4 py-3">{course?.numberoflectures}</td>
										<td className="px-4 py-3">
											<div className="w-40 sm:w-48 break-words line-clamp-2">
												{course?.description}
											</div>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center justify-center gap-2">
												<button
													onClick={() =>
														navigate(
															`/course/displaylectures`,
															{ state: { ...course } }
														)
													}
													title="Play lectures"
													className="bg-green-500 hover:bg-green-600 transition-all duration-300 rounded p-2 text-black text-lg cursor-pointer">
													<BsCollectionPlayFill />
												</button>
												<button
													onClick={() =>
														onCourseDelete(course?._id)
													}
													title="Delete course"
													className="bg-red-500 hover:bg-red-600 transition-all duration-300 rounded p-2 text-white text-lg cursor-pointer">
													<BsTrash />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</HomeLayout>
	);
}

export default AdminDashboard;
