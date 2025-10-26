import { createFileRoute } from '@tanstack/react-router'
import Inbox from '../components/pages/Inbox'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { axiosRequest } from '../components/helpers/config'

export const Route = createFileRoute('/Inbox')({
  component: RouteComponent,
})



function RouteComponent() {
  const [notifications, setNotifications] = useState<any[]>([])

  const token = localStorage.getItem('access_token')

  const { data: profileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axiosRequest.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    enabled: !!token,
  });


  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return
      try {

        // mensajes de comisiones recibidas
        const { data: commissions } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/user/commisions/${profileData?.user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const myCommissions = commissions.commissions.filter(
          (comission: any) => comission.to_user_id === profileData?.user?.id
        )


        // mensajes del muro
        const { data: messages } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/profile/${profileData?.user?.id}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const myNotifications = messages.filter(
          (profile_message: any) => profile_message.to_user_id === profileData?.user?.id
        )

        // followers recibidos en las publicaciones
        const { data } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/user/comments/${profileData?.user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const myComments = data.comments.filter(
          (comments: any) => parseInt(comments.for_user_id) === profileData?.user?.id
        )

        const { data: followersData } = await axios.get(
          `https://harixom-desarrollo.onrender.com/api/user/follows`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const myFollowers = followersData.followers

        setNotifications([...myNotifications, ...myCommissions, ...myComments, ...myFollowers])


      } catch (err) {
        console.error('Error fetching messages wall:', err)
      }
    }

    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 15000);
    return () => clearInterval(intervalId);
  }, [token, profileData?.user?.id])



  return (
    <Inbox
      prioritys={notifications.map((number) => (number.status))}
      notification="Notifications"
      titles={notifications.map((number) => number.title || 'New Commission')}
      users={notifications.map((number) => number.from_user?.name || number.user?.name || number.name)}
      UsersID={notifications.map((number) => number.from_user?.id || number.user?.id || number.id)}
      texts={notifications.map((number) => number.message || number.comment)}
      dates={notifications.map((number) => number.created_at?.split('T')[0])}
      images={notifications.map(() => 'bell.svg')}
      alts={notifications.map(() => 'bell')}
    />
  )
}
