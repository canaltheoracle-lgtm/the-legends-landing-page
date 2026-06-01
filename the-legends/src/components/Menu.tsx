import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import AddonModal from './AddonModal';

interface Addon {
  id: number;
  name: string;
  price: number;
  groupId: number;
  available: boolean;
  sortOrder: number;
}

interface AddonGroup {
  id: number;
  name: string;
  productId: number;
  minOptions: number;
  maxOptions: number;
  sortOrder: number;
  addons: Addon[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  category_name?: string;
  categoryId?: number;
  category_id?: number;
  available: boolean;
  imageUrl?: string;
  image_url?: string;
  allergens?: string;
  variations?: string;
  createdAt?: string;
  updatedAt?: string;
  addonGroups?: AddonGroup[];
}

interface Category {
  id: number;
  name: string;
  sort_order: number;
  created_at?: string;
}

const colorClasses = [
  'bg-retro-red',
  'bg-retro-blue',
  'bg-retro-green',
  'bg-retro-orange',
  'bg-retro-purple'
];

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          fetch('http://localhost:3001/api/products/categories').then(res => res.json())
        ]);
        setProducts(productsData.filter((p: Product) => p.available));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Agrupar produtos por categoria
  const getProductsByCategory = (categoryId?: number | null) => {
    if (!categoryId) {
      return products.filter(p => !p.categoryId && !p.category_id);
    }
    return products.filter(p => p.categoryId === categoryId || p.category_id === categoryId);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const fullProduct = await api.getProduct(product.id);
      if (fullProduct.addonGroups && fullProduct.addonGroups.length > 0) {
        setSelectedProduct(fullProduct);
        setIsModalOpen(true);
      } else {
        addToCart(fullProduct);
      }
    } catch (error) {
      console.error('Failed to load product details:', error);
      addToCart(product);
    }
  };

  const handleConfirmAdd = (addons: Addon[], observation: string) => {
    if (selectedProduct) {
      addToCart(selectedProduct, addons, observation);
    }
  };

  if (loading) {
    return (
      <section id="menu" className="py-12 md:py-20 px-4 bg-retro-bg flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-retro-yellow animate-spin" />
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="menu" className="py-12 md:py-20 px-4 bg-retro-bg">
        <div className="container mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-5xl mb-4 px-2">INVENTÁRIO DE LANCHES</h2>
          <p className="font-retro text-[9px] md:text-xs text-gray-500">NENHUM ITEM DISPONÍVEL AINDA</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="menu" className="py-12 md:py-20 px-4 bg-retro-bg">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-5xl mb-4 px-2">INVENTÁRIO DE LANCHES</h2>
            <p className="font-retro text-[9px] md:text-xs text-retro-yellow">SELECIONE SEU POWER-UP</p>
          </div>

          {/* Renderizar categorias na ordem definida */}
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category.id);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.id} className="mb-12 md:mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-lg sm:text-xl md:text-3xl font-retro text-white">{category.name.toUpperCase()}</h3>
                  <div className="flex-1 h-px bg-gray-700"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {categoryProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className="retro-border bg-black p-4 md:p-6 flex flex-col items-center text-center group"
                    >
                      <div className={`w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6 ${colorClasses[index % colorClasses.length]} flex items-center justify-center pixelated shadow-[4px_4px_0px_0px_var(--color-retro-yellow)] overflow-hidden`}>
                        {product.imageUrl && !failedImages.has(product.id) ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            onError={() => {
                              setFailedImages(prev => new Set(prev).add(product.id));
                            }}
                          />
                        ) : (
                          <span className="font-retro text-xl md:text-2xl text-white">🍔</span>
                        )}
                      </div>
                      <h3 className="text-xs md:text-sm mb-3 md:mb-4 group-hover:text-retro-yellow transition-colors">{product.name.toUpperCase()}</h3>
                      <p className="text-[9px] md:text-[10px] text-gray-400 font-game mb-4 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                      <div className="mt-auto w-full">
                        <div className="font-retro text-sm md:text-lg text-retro-yellow">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="retro-button mt-4 w-full py-2 text-[8px] flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3 h-3" />
                          EQUIPAR
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Produtos sem categoria */}
          {(() => {
            const uncategorizedProducts = getProductsByCategory(null);
            if (uncategorizedProducts.length === 0) return null;

            return (
              <div className="mb-12 md:mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-lg sm:text-xl md:text-3xl font-retro text-white">OUTROS</h3>
                  <div className="flex-1 h-px bg-gray-700"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {uncategorizedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className="retro-border bg-black p-4 md:p-6 flex flex-col items-center text-center group"
                    >
                      <div className={`w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6 ${colorClasses[index % colorClasses.length]} flex items-center justify-center pixelated shadow-[4px_4px_0px_0px_var(--color-retro-yellow)] overflow-hidden`}>
                        {product.imageUrl && !failedImages.has(product.id) ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                            onError={() => {
                              setFailedImages(prev => new Set(prev).add(product.id));
                            }}
                          />
                        ) : (
                          <span className="font-retro text-xl md:text-2xl text-white">🍔</span>
                        )}
                      </div>
                      <h3 className="text-xs md:text-sm mb-3 md:mb-4 group-hover:text-retro-yellow transition-colors">{product.name.toUpperCase()}</h3>
                      <p className="text-[9px] md:text-[10px] text-gray-400 font-game mb-4 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                      <div className="mt-auto w-full">
                        <div className="font-retro text-sm md:text-lg text-retro-yellow">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="retro-button mt-4 w-full py-2 text-[8px] flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3 h-3" />
                          EQUIPAR
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {selectedProduct && (
        <AddonModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onConfirm={handleConfirmAdd}
        />
      )}
    </>
  );
};

export default Menu;
