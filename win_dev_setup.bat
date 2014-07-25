@echo off
echo "Instaling virtualenv"
pip install virtualenv
echo "Creating virtualenv for project"
virtualenv --no-site-packages env
echo "Part 1 of 2 Completed. Run '2_win_dev_setup' to complete second step."
env\Scripts\activate