import { useNavigate } from "react-router-dom"

function CourseCard({ data }) {
  const navigate = useNavigate()
  
  
  return (
    <div
      onClick={() => navigate('/course/description', { state: { ...data } })}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate('/course/description', { state: { ...data } });
        }
      }}
      className="text-white w-full max-w-[22rem] sm:w-[22rem] h-[430px] shadow-lg hover:shadow-2xl hover:shadow-yellow-500/10 rounded-lg cursor-pointer group overflow-hidden bg-zinc-800 border border-zinc-700 hover:border-yellow-500/50 hover:-translate-y-1.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500">
      <div className="overflow-hidden relative">
              <img
                className="h-48 w-full rounded-t-lg object-cover group-hover:scale-105 transition-all ease-in-out duration-300"
                src={data?.thumbnail?.secure_url}
                alt={data?.title}
              />
          <div className="p-4 space-y-2 text-white">
              <h2 className="text-xl font-bold text-yellow-500 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                {data?.title}
              </h2>
              <p className="line-clamp-2 text-sm text-gray-300 leading-relaxed">
                {data?.description}
              </p>
              <div className="pt-2 border-t border-zinc-700 space-y-1 text-sm">
                <p className="font-semibold text-gray-200">
                  <span className="text-yellow-500 font-bold">Category :&nbsp;</span>
                  {data?.category}
                </p>
                <p className="font-semibold text-gray-200">
                  <span className="text-yellow-500 font-bold">Total Lectures :&nbsp;</span>
                  {data?.numberoflectures}
                </p>
                <p className="font-semibold text-gray-200">
                  <span className="text-yellow-500 font-bold">Instructor :&nbsp;</span>
                  {data?.createdBy}
                </p>
              </div>
          </div>
      </div>
    </div>
  )
}

export default CourseCard
