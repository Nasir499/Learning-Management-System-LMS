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
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import toast from "react-hot-toast";
import { BsCollectionPlayFill, BsTrash } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../Helpers/axiosinstance";
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

	const [payouts, setPayouts] = useState([]);

	const { allUserCount, instructorsCount, subscribedCount } = useSelector(
		(state) => state.stat
	);

	const { allPayments, monthlySalesRecords } = useSelector(
		(state) => state.razorpay
	);

	const userData = {
		labels: ["Registered Users", "Instructors", "Enrolled Users"],
		datasets: [
			{
				label: "User Details",
				backgroundColor: ["#EAB308", "#3B82F6", "#22C55E"],
				data: [allUserCount, instructorsCount || 0, subscribedCount],
				borderWidth: 1,
			},
		],
	};

	const myCourses = useSelector((state) => state?.course?.courseData);

	async function fetchPayouts() {
		try {
			const res = await axiosInstance.get('/payments/admin/payouts');
			if (res?.data?.success) {
				setPayouts(res.data.payouts || []);
			}
		} catch (e) {
			console.error("Failed to fetch payouts", e);
		}
	}

	async function handleMarkPaid(payoutId) {
		try {
			const res = await axiosInstance.put(`/payments/admin/payouts/${payoutId}/pay`);
			if (res?.data?.success) {
				toast.success("Payout marked as PAID!");
				fetchPayouts();
			}
		} catch (e) {
			toast.error(e?.response?.data?.message || "Failed to update payout status");
		}
	}

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
			await fetchPayouts();
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

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
							<div className="flex items-center justify-between p-4 rounded-md shadow-md gap-3 bg-gray-800/60 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50">
								<div className="flex flex-col items-start">
									<p className="font-semibold text-xs sm:text-sm text-gray-300">
										Registered Users
									</p>
									<h3 className="text-xl sm:text-3xl font-bold">
										{allUserCount}
									</h3>
								</div>
								<FaUsers className="text-yellow-500 text-2xl sm:text-4xl" />
							</div>
							<div className="flex items-center justify-between p-4 rounded-md shadow-md gap-3 bg-gray-800/60 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50">
								<div className="flex flex-col items-start">
									<p className="font-semibold text-xs sm:text-sm text-gray-300">
										Instructors
									</p>
									<h3 className="text-xl sm:text-3xl font-bold text-blue-400">
										{instructorsCount || 0}
									</h3>
								</div>
								<FaUsers className="text-blue-400 text-2xl sm:text-4xl" />
							</div>
							<div className="flex items-center justify-between p-4 rounded-md shadow-md gap-3 bg-gray-800/60 hover:bg-gray-800 hover:-translate-y-1 transition-all duration-300 border border-gray-700/50">
								<div className="flex flex-col items-start">
									<p className="font-semibold text-xs sm:text-sm text-gray-300">
										Enrolled Users
									</p>
									<h3 className="text-xl sm:text-3xl font-bold text-green-400">
										{subscribedCount}
									</h3>
								</div>
								<FaUsers className="text-green-500 text-2xl sm:text-4xl" />
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
									<h3 className="text-2xl sm:text-4xl font-bold text-green-400">
										₹ {((allPayments?.count || 0) * 499).toLocaleString()}
									</h3>
								</div>
								<GiMoneyStack className="text-green-500 text-3xl sm:text-5xl" />
							</div>
						</div>
					</div>
				</div>

				{/* Instructor Payouts Management Section */}
				<div className="w-full flex flex-col items-center justify-center gap-6">
					<div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4">
						<h1 className="text-center text-2xl sm:text-3xl font-semibold text-yellow-500">
							Instructor Payouts Management
						</h1>
					</div>

					<div className="w-full overflow-x-auto rounded-lg shadow-md border border-gray-700">
						<table className="table w-full text-left text-sm">
							<thead className="bg-gray-800 text-gray-200">
								<tr>
									<th className="px-4 py-3">S No</th>
									<th className="px-4 py-3">Instructor</th>
									<th className="px-4 py-3">Course</th>
									<th className="px-4 py-3">Price</th>
									<th className="px-4 py-3">Instructor Share (80%)</th>
									<th className="px-4 py-3">Bank / UPI Info</th>
									<th className="px-4 py-3">Status</th>
									<th className="px-4 py-3 text-center">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-700">
								{payouts && payouts.length > 0 ? (
									payouts.map((payout, index) => (
										<tr key={payout._id} className="hover:bg-gray-800/50">
											<td className="px-4 py-3">{index + 1}</td>
											<td className="px-4 py-3 font-semibold">{payout?.instructor?.fullName || "N/A"}</td>
											<td className="px-4 py-3">{payout?.course?.title || "N/A"}</td>
											<td className="px-4 py-3">₹ {payout?.coursePrice}</td>
											<td className="px-4 py-3 font-bold text-green-400">₹ {payout?.instructorEarnings}</td>
											<td className="px-4 py-3 text-xs">
												{payout?.instructor?.bankDetails?.upiId ? (
													<div>UPI: <span className="text-yellow-400 font-mono">{payout.instructor.bankDetails.upiId}</span></div>
												) : payout?.instructor?.bankDetails?.accountNumber ? (
													<div>A/C: <span className="font-mono">{payout.instructor.bankDetails.accountNumber}</span> ({payout.instructor.bankDetails.ifscCode})</div>
												) : (
													<span className="text-gray-400 italic">No bank info added</span>
												)}
											</td>
											<td className="px-4 py-3">
												<span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${payout?.status === 'PAID' ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'}`}>
													{payout?.status}
												</span>
											</td>
											<td className="px-4 py-3 text-center">
												{payout?.status === 'PENDING' ? (
													<button
														onClick={() => handleMarkPaid(payout._id)}
														className="bg-green-500 hover:bg-green-600 text-black font-semibold px-3 py-1.5 rounded text-xs transition-all cursor-pointer shadow">
														Mark Paid
													</button>
												) : (
													<span className="text-xs text-gray-400">Completed</span>
												)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="8" className="text-center py-6 text-gray-400">No payout records found.</td>
									</tr>
								)}
							</tbody>
						</table>
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
									<th className="px-4 py-3">Price</th>
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
										<td className="px-4 py-3 font-semibold text-green-400">₹ {course?.price || 499}</td>
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
