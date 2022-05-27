import "../styling/ProfileImage.scss"
import { useNavigate } from "react-router-dom"

const ProfileImage = ({ user }: { user: { id:string, photoUrl?: string, firstName: string } }) => {
  const navigate = useNavigate()
  return (
    <div onClick={()=> navigate(`/profile/${user.id}`)} className="ProfileImage" style={{ backgroundImage: user.photoUrl ? `url("${user.photoUrl}")` : `url("https://gradient-avatar.glitch.me/${user.id}")` }}>
      <span>
        {user.photoUrl ? '' : user.firstName[0]}
      </span>
    </div>
  )
}

export default ProfileImage 