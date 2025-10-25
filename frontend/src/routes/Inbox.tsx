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
        const { data: commissions } = await axios.get(
          `http://127.0.0.1:8000/api/user/commisions/${profileData?.user?.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const myCommissions = commissions.commissions.filter(
          (comission: any) => comission.to_user_id === profileData?.user?.id
        )
      
        const { data: messages } = await axios.get(

          `http://127.0.0.1:8000/api/profile/${profileData?.user?.id}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const myNotifications = messages.filter(
          (profile_message: any) => profile_message.to_user_id === profileData?.user?.id
        )

        setNotifications([...myNotifications, ...myCommissions])

      } catch (err) {
        console.error('Error fetching messages wall:', err)
      }
    }
    
    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [token, profileData?.user?.id])


  return (
    <Inbox
      prioritys={notifications.map((number) => (number.status))}
      notification="Notifications"
      titles={notifications.map((number) => number.title || 'New Commission')}
      users={notifications.map((number) => number.from_user.name)}
      UsersID={notifications.map((number) => number.from_user.id)}
      texts={notifications.map((number) => number.message)}
      dates={notifications.map((number) => new Date(number.created_at).toLocaleDateString())}
      images={notifications.map(() => 'bell.svg')}
      alts={notifications.map(() => 'bell')}
    />
  )
}
