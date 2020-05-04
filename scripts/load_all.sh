# download all from drive
# run load_dataset for each, 
host=localhost
data_dir=$1

# Import datasets
datasets=(watermask_500 slope_500 forest_500 marsh_500 flow_500)

for i in "${datasets[@]}"
do
    full_path="$data_dir/$i"
    ./load_dataset.sh $full_path $i
done