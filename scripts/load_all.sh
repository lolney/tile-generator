# download all from drive
# run load_dataset for each, 
host=localhost
data_dir=$1

# Import Koppen data
dst="$1/world_climates_completed_koppen_geiger.gz"
dir="$1/Koppen_Geiger Edited and Completed"
url=https://ia800707.us.archive.org/22/items/KoppenGeigerEditedAndCompleted/Koppen_Geiger%20Edited%20and%20Completed.zip

if [ ! -f $dir ]; then 
wget -nc -O - $url > $dst
unzip $dst -d $dir
shp2pgsql -I -s 4326 "$dir/shapefiles/world_climates_completed_koppen_geiger.shp" | psql -h $host -d tilegenerator -U postgres
fi

# Import datasets
datasets=(watermask_500 slope_500 forest_500 marsh_500 flow_500)

for i in "${datasets[@]}"
do
    full_path="$data_dir/$i"
    ./load_dataset.sh $full_path $i
done