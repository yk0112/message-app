import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div
      className="
    	flex min-h-full 
    	flex-col 
    	justify-center 
    	py-12 
    	sm:px-6 
    	lg:px-6 
    	bg-gray-100"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2
          className="
         p-3
	 text-center
	 text-5xl
	 font-bold
	 tracking-tight
	 bg-gradient-to-r 
	 from-blue-600 
	 via-green-500 
	 to-indigo-400 
	 text-transparent 
	 bg-clip-text
	"
        >
          Message App
        </h2>
      </div>
      <AuthForm />
    </div>
  );
}
