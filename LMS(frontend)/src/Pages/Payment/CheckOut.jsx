import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import HomeLayout from '../../Layouts/HomeLayout';
import { getRazorPayId, purchaseCourseBundle, verifyUserPayment } from '../../Redux/Slices/RazorpaySlice';

function CheckOut() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const razorPayKey = useSelector((state) => state?.razorpay?.key);
  const subscription_id = useSelector((state) => state?.razorpay?.subscription_id);
  const userData = useSelector((state) => state?.auth?.data);
  const paymentDetails = {
    razorpay_payment_id: "",
    razorpay_subscription_id: "",
    razorpay_signature: "",
  }

  async function handleSubscription(e) {
    e.preventDefault()
    if (!razorPayKey || !subscription_id) {
      toast.error("Something went wrong");
      return
    }

    const options = {
      key: razorPayKey,
      subscription_id: subscription_id,
      name: "Provat kaku Private ltd.",
      description: "Subscription",
      handler: async function (response) {
        paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
        paymentDetails.razorpay_signature = response.razorpay_signature;
        paymentDetails.razorpay_subscription_id = response.razorpay_subscription_id;
        console.log(paymentDetails);
        
        toast.success("Payment successfull")

        const res = await dispatch(verifyUserPayment(paymentDetails))
        console.log(res.payload);
        (res?.payload?.success) ? navigate("/checkout/success") : navigate("/checkout/fail")
      },
      theme: {
        color: "#f37254"
      },
      prefill: {
        email: userData.email || "",
        name: userData.fullName || ""
      },
    }
    if (window.Razorpay) {
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    }
    else{
      toast.error("Razorpay SDK failed to load")
    }

  }

  useEffect(() => {
    dispatch(getRazorPayId());
    // Only create a new subscription if one isn't already pending
    if (!subscription_id) {
      dispatch(purchaseCourseBundle());
    }
  }, [dispatch, subscription_id])
  return (
    <HomeLayout>
      <form
        className='min-h-[90vh] py-10 px-4 flex items-center justify-center text-white'
        onSubmit={handleSubscription}
      >
        <div className='w-full max-w-sm flex flex-col justify-between shadow-[0_0_10px_black] rounded-lg relative overflow-hidden bg-gray-800/40 border border-gray-700 pb-5'>
          <h1 className='bg-yellow-500 w-full text-center py-4 text-xl sm:text-2xl font-bold text-black'>Subscription Bundle</h1>
          <div className='p-5 space-y-5 text-center flex-1 flex flex-col justify-between'>
            <p className='text-sm sm:text-base text-gray-200 leading-relaxed'>
              This is a one time payment bundle which includes all the courses in this platform for
              <span className='text-yellow-500 font-bold'>&nbsp;1 year duration</span>.&nbsp;
              All existing and upcoming courses will be available in this bundle.
            </p>
            <p className='flex items-center justify-center gap-1 text-2xl font-bold text-yellow-500'>
              <BiRupee /><span>499</span>&nbsp;only
            </p>
            <div className='text-xs text-gray-300 space-y-1'>
              <p>100% refund policy</p>
              <p>* terms and conditions apply</p>
            </div>
            <button
              type='submit'
              className='w-full bg-yellow-500 text-black font-semibold py-2.5 rounded-lg hover:bg-yellow-600 transition-all duration-300 cursor-pointer text-base sm:text-lg'
            >
              Subscribe Now
            </button>
          </div>
        </div>

      </form>
    </HomeLayout>
  )
}

export default CheckOut