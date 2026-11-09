import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { waLink } from '../../../config/whatsapp'
import styles from './WhatsAppFab.module.css'

export function WhatsAppFab() {
  return (
    <motion.a className={styles.fab} href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, type: 'spring' }}>
      <MessageCircle size={26} />
    </motion.a>
  )
}
