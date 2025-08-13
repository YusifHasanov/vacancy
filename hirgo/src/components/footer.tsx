import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link';

export function FooterComponent() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Şirkət</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="#" className="hover:text-primary">Haqqımızda</Link>
              <Link href="#" className="hover:text-primary">Karyeralar</Link>
              <Link href="#" className="hover:text-primary">Mətbuat</Link>
              <Link href="#" className="hover:text-primary">Bloq</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İmkanlar</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="#" className="hover:text-primary">CV Şablonları</Link>
              <Link href="#" className="hover:text-primary">İş Axtarma Məsləhətləri</Link>
              <Link href="#" className="hover:text-primary">Müsahibəyə Hazırlıq</Link>
              <Link href="#" className="hover:text-primary">Karyera Məsləhətləri</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dəstək</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="#" className="hover:text-primary">Kömək Mərkəzi</Link>
              <Link href="#" className="hover:text-primary">Bizimlə Əlaqə</Link>
              <Link href="#" className="hover:text-primary">Məxfilik Siyasəti</Link>
              <Link href="#" className="hover:text-primary">Xidmət Şərtləri</Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Əlaqədə qal</h3>
            <p className="text-sm text-muted-foreground">Ən son yeniliklər və iş imkanları üçün bülletenimizə qoşulun.</p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Mail ünvanını daxil et"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
                <span className="sr-only">Xəbərlərə abunə ol</span>
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Zabrat. Bütün hüquqlar qorunur.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}