import { createServerSupabaseClient } from '@/lib/supabase/server';
import ProductGrid from '@/components/ProductGrid';
import TriggersShell from '@/components/TriggersShell';

export const dynamic = 'force-dynamic';

type ShopProduct = { id:string; name:string; slug:string; price:number; currency:string; main_image_url:string|null; stock_quantity:number; categories:{name:string}|{name:string}[]|null };

export default async function ShopPage(){
  let products:ShopProduct[]=[];
  let errorMessage='';
  try{
    const supabase=await createServerSupabaseClient();
    const result=await supabase.from('products').select('id, name, slug, price, currency, main_image_url, stock_quantity, categories(name)').eq('is_active',true).order('created_at',{ascending:false});
    if(result.error){ console.error('Triggers Nation shop products error:',result.error.message); errorMessage='Products are temporarily unavailable.'; } else products=(result.data??[]) as ShopProduct[];
  }catch(error){ console.error('Triggers Nation shop configuration error:',error); errorMessage='Products are temporarily unavailable.'; }
  return <TriggersShell><section className="inner-hero shop-hero"><div className="trigger-container"><span>TRIGGERS NATION ARMORY</span><h1>MISSION<br /><em>READY GEAR.</em></h1><p>Browse tactical gear, military equipment and outdoor essentials.</p></div></section><section className="trigger-container content-section">{errorMessage?<div className="trigger-empty"><h2>{errorMessage}</h2><p>Please try again shortly.</p></div>:<ProductGrid products={products}/>}</section></TriggersShell>;
}
