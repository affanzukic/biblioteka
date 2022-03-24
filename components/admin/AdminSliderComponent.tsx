import { useEffect, useState, FC } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"

interface ISlider {
    dataArray?: Array<object>
}

const AdminSliderComponent: FC<ISlider> = ({dataArray}) => {
    const [currentScreen, setCurrentScreen] = useState(0)
    useEffect(() => {
        AOS.init({
            duration: 300
        })
    }, [])
    return (
        <div id="slider" className="flex flex-row justify-between dark:bg-gray-800 h-96 content-center">
            <div id="backward-arrow" className="flex my-auto cursor-pointer dark:hover:border-2">
                <IoIosArrowBack size="35" className="my-auto" />
            </div>
        </div>
    )
}

export default AdminSliderComponent