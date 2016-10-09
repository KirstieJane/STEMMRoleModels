#!/usr/bin/env python

"""
Hello, I am a doc string.
I'm working through the README of this awesome tool: https://github.com/burnash/gspread
"""

import gspread
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds']

# AUTHORISE ACCESS TO THE GOOGLE API
# Note that this works for Kirstie...if you need access then speak with her :)
credentials = ServiceAccountCredentials.from_json_keyfile_name('../../../../Documents/SecretKeys/STEMMRoleModels-8d77c616ce89.json', scope)
gc = gspread.authorize(credentials)

# Get the different worksheet data

# STEMMRM_RecommendationAcceptance (Responses)
ws_rec_acceptance = gc.open_by_key("1DNtbdom1VRXvnXXjJjS9LnMq1iAptUBTYEC3TLJvvJg").get_worksheet(0)
rec_acceptance_data = ws_rec_acceptance.get_all_values()
if len(rec_acceptance_data) > 2:
    df_rec_acceptance = pd.DataFrame(rec_acceptance_data[2:])
    df_rec_acceptance.columns = rec_acceptance_data[1]
else:
    df_rec_acceptance = pd.DataFrame(columns=rec_acceptance_data[1])

# STEMMRM_TestimonialForm (Responses)
ws_testimonials = gc.open_by_key("1znW2kTaDg7ohh0rc1iiW4UawBv-7e2mFVpOJXYfp0MY").get_worksheet(0)
testimonials_data = ws_testimonials.get_all_values()
if len(testimonials_data) > 2:
    df_testimonials = pd.DataFrame(testimonials_data[2:])
    df_testimonials.columns = testimonials_data[1]
else:
    df_testimonials = pd.DataFrame(columns=testimonials_data[1])

# STEMMRM_RecommendationForm (Responses)
ws_recommendation = gc.open_by_key("1YBrKIDORQdN8BsfrRGbfqN2RekhsxUneobfH3CsYU58").get_worksheet(0)
recommendation_data = ws_recommendation.get_all_values()
if len(recommendation_data) > 2:
    df_recommendation = pd.DataFrame(recommendation_data[2:])
    df_recommendation.columns = recommendation_data[1]
else:
    df_recommendation = pd.DataFrame(columns=recommendation_data[1])

# STEMMRM_data
ws_database_data = gc.open_by_key('1x5k30BR1z8nVY8iUqvZa-YiZMVtRbvs71FcWjFDiL28').get_worksheet(0)
database_data = ws_database_data.get_all_values()
if len(database_data) > 2:
    df_database_data = pd.DataFrame(database_data[2:])
    df_database_data.columns = database_data[1]
else:
    df_database_data = pd.DataFrame(columns=database_data[1])


#===============================================================================
# Merge the data
#===============================================================================

# Fill in the columns of the df_database_data with the information provided
# by the role model herself if she approved the addition at the end of the form
for col in df_rec_acceptance.columns[1:]:
    df_database_data.loc[:, col] = df_rec_acceptance.loc[df_rec_acceptance['approval']=='Approved', col]

# Now fill in the spreadsheet itself
for i in range(len(df_database_data)):
    cell_list = ws_database_data.range('A{}:Q{}'.format(2+i, 2+i))
    data_list = list(df_database_data.iloc[i, :])

    for cell, data in zip(cell_list, data_list):
        cell.value = data

# Updaaate to google sheets
ws_database_data.update_cells(cell_list)

#===============================================================================
# What do we need to add?

* joined-date
* rec-name
* speaker-name
*
