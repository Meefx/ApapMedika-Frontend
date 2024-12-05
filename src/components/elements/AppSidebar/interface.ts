import type { Component } from 'vue'

export interface SidebarItemProps {
  title: string
  url: string
  icon: Component
  showWhen: boolean
}
