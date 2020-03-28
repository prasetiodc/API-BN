# API-BN

## **User Route**

- **Signup**
  - URL:
    - `POST /user/signup`
  - Body:
    - `nik`: `String`, required
    - `name`: `String`, required
    - `email`: `String`, required
    - `password`: `String`, required (include 6 length, 1 Capital, 1 Small, 1 Symbol)
    - `role_id`: `String`, (default MD) 
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "id": "...",
            "nik": "...",
            "name": "...",
            "email": "..."
          }
        }
      ```
    - Error (status: `400, 500`)

- **Signin**
  - URL:
    - `POST /user/signin`
  - Body:
    - `email`: `String`, required
    - `password`: `String`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "token": "...",
            "user_id": "...",
            "name": "...",
            "role_id": "..."
          }
        }
      ```
    - Error (status: `400, 500`)

- **Find All Users**
  - URL:
    - `GET /user`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": [
            {
              "id": "...",
              "nik": "...",
              "name": "...",
              "email": "...",
              "role_id": "...",
              "login_date": "...",
              "tbl_role": {
                "id": "...",
                "role": "...",
              }
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find A User**
  - URL:
    - `GET /user/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": {
            "id": "...",
            "nik": "...",
            "name": "...",
            "email": "...",
            "role_id": "...",
            "login_date": "...",
            "tbl_role": {
              "id": "...",
              "role": "...",
            }
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Edit A User**
  - URL:
    - `PUT /user/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `name`: `String`,
    - `email`: `String`,
    - `password`: `String`, (include 6 length, 1 Capital, 1 Small, 1 Symbol)
    - `role_id`: `String`, (default MD) 
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "id": "...",
            "nik": "...",
            "name": "...",
            "email": "...",
            "tbl_role": {
              "id": "...",
              "role": "..."
            }
          }
        }
      ```
    - Error (status: `400, 401, 500`)













- **Delete A User**
  - URL:
    - `DELETE /user/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)


---

## **Retailer Route**

- **Create A Retailer**
  - URL:
    - `POST /retailer`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `name`: `String`, required
    - `initial`: `String`, required 
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "id": "...",
            "retailer_name": "...",
            "initial": "...",
            "total_store": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find All Retailer**
  - URL:
    - `GET /retailer`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": [
            {
              "id": "...",
              "retailer_name": "...",
              "initial": "...",
              "total_store": "..."
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find A Retailer**
  - URL:
    - `GET /retailer/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": {
            "id": "...",
            "retailer_name": "...",
            "initial": "...",
            "total_store": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Edit A Retailer**
  - URL:
    - `PUT /retailer/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `name`: `String`,
    - `initial`: `String`,
    - `total_store`: `Integer`
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "id": "...",
            "retailer_name": "...",
            "initial": "...",
            "total_store": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Delete A Retailer**
  - URL:
    - `DELETE /retailer/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)


---

## **Store Route**

- **Create A Store**
  - URL:
    - `POST /store`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `store_code`: `String`, required
    - `store_name`: `String`, required
    - `retailer_id`: `Integer`, required
    - `dc_id`: `Integer`, required
    - `address`: `String`, required
    - `sub_district`: `String`, required
    - `district`: `String`, required
    - `city`: `String`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "store_code": "...",
            "store_name": "...",
            "retailer_id": "...",
            "dc_id": "...",
            "address": "...",
            "sub_district": "...",
            "district": "...",
            "city": "...",
            "tbl_dc": {
              "id": "...",
              "DC_name": "..."
            },
            "tbl_retailer": {
              "id": "...",
              "retailer_name": "...",
              "initial": "...",
              "total_store": "..."
            }
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find All Store**
  - URL:
    - `GET /store`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": [
            {
              "store_code": "...",
              "store_name": "...",
              "retailer_id": "...",
              "dc_id": "...",
              "address": "...",
              "sub_district": "...",
              "district": "...",
              "city": "...",
              "tbl_dc": {
                "id": "...",
                "DC_name": "..."
              },
              "tbl_retailer": {
                "id": "...",
                "retailer_name": "...",
                "initial": "...",
                "total_store": "..."
              }
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find A Store**
  - URL:
    - `GET /store/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": {
            "store_code": "...",
            "store_name": "...",
            "retailer_id": "...",
            "dc_id": "...",
            "address": "...",
            "sub_district": "...",
            "district": "...",
            "city": "...",
            "tbl_dc": {
              "id": "...",
              "DC_name": "..."
            },
            "tbl_retailer": {
              "id": "...",
              "retailer_name": "...",
              "initial": "...",
              "total_store": "..."
            }
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Edit A Store**
  - URL:
    - `PUT /store/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `store_name`: `String`, 
    - `retailer_id`: `Integer`, 
    - `dc_id`: `Integer`, 
    - `address`: `String`, 
    - `sub_district`: `String`, 
    - `district`: `String`, 
    - `city`: `String`
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
              "store_code": "...",
              "store_name": "...",
              "retailer_id": "...",
              "dc_id": "...",
              "address": "...",
              "sub_district": "...",
              "district": "...",
              "city": "...",
              "tbl_dc": {
                "id": "...",
                "DC_name": "..."
              },
              "tbl_retailer": {
                "id": "...",
                "retailer_name": "...",
                "initial": "...",
                "total_store": "..."
              }
            }
        }
      ```
    - Error (status: `400, 401, 500`)













- **Delete A Store**
  - URL:
    - `DELETE /store/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)


---

## **DC Route**

- **Create A DC**
  - URL:
    - `POST /dc`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `DC_name`: `String`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "id": "...",
            "DC_name": "...",
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find All DC**
  - URL:
    - `GET /dc`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": [
            {
              "id": "...",
              "DC_name": "...",
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find A DC**
  - URL:
    - `GET /dc/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": {
            "id": "...",
            "DC_name": "...",
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Edit A DC**
  - URL:
    - `PUT /dc/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
      - `DC_name`: `String`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "id": "...",
            "DC_name": "...",
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Delete A DC**
  - URL:
    - `DELETE /dc/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)


---

## **Fixture Type Route**

- **Create A Fixture Type**
  - URL:
    - `POST /fixture-type`
  - Header:
    - `token`: `<Token>`, required,
  - Body:
    - `fixture_type`: `String`, required
    - `google_50k`:  `Integer`, required
    - `google_100k`: `Integer`, required
    - `google_150k`: `Integer`, required
    - `google_300k`: `Integer`, required
    - `google_500k`: `Integer`, required
    - `spotify_1m`:  `Integer`, required
    - `spotify_3m`:  `Integer`, required
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "id": "...",
            "fixture_type":  "...",
            "google_50k": "...",
            "google_100k": "...",
            "google_150k": "...",
            "google_300k": "...",
            "google_500k": "...",
            "spotify_1m": "...",
            "spotify_3m": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find All Fixture Types**
  - URL:
    - `GET /fixture-type`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": [
            {
              "id": "...",
              "fixture_type":  "...",
              "google_50k": "...",
              "google_100k": "...",
              "google_150k": "...",
              "google_300k": "...",
              "google_500k": "...",
              "spotify_1m": "...",
              "spotify_3m": "..."
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find A Fixture Type**
  - URL:
    - `GET /fixture-type/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": {
            "id": "...",
            "fixture_type":  "...",
            "google_50k": "...",
            "google_100k": "...",
            "google_150k": "...",
            "google_300k": "...",
            "google_500k": "...",
            "spotify_1m": "...",
            "spotify_3m": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Edit A Fixture Type**
  - URL:
    - `PUT /fixture-type/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `fixture_type`: `String`, 
    - `google_50k`:  `Integer`, 
    - `google_100k`: `Integer`, 
    - `google_150k`: `Integer`, 
    - `google_300k`: `Integer`, 
    - `google_500k`: `Integer`, 
    - `spotify_1m`:  `Integer`, 
    - `spotify_3m`:  `Integer`, 
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "id": "...",
            "fixture_type":  "...",
            "google_50k": "...",
            "google_100k": "...",
            "google_150k": "...",
            "google_300k": "...",
            "google_500k": "...",
            "spotify_1m": "...",
            "spotify_3m": "..."
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Delete A Fixture Type**
  - URL:
    - `DELETE /fixture-type/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)


---

## **Visit Route**

- **Create A Visit**
  - URL:
    - `POST /visit`
  - Header:
    - `token`: `<Token>`, required,
  - Body:
    - `files`: [
        {
          `File`, `img_store`,
        }, {
          `File`, `img_fixture_in`,
        }, {
          `File`, `img_fixture_out`,
        }
      ]
    - `fixture_type_id_1`: `Integer`,
    - `fixture_type_id_2`: `Integer`,
    - `visit_date`: `Date`,
    - `store_code`: `String`,
    - `entry_fixture_comp`: `Boolean`,
    - `entry_peg_comp`: `Boolean`,
    - `entry_pog_comp`:  `Boolean`,
    - `entry_pop_pic_1`: `Boolean`,
    - `entry_pop_pic_2`: `Boolean`,
    - `entry_google50k`: `Boolean`,
    - `entry_google100k`: `Boolean`,
    - `entry_google150k`: `Boolean`,
    - `entry_google300k`: `Boolean`,
    - `entry_google500k`: `Boolean`,
    - `entry_spotify1M`: `Boolean`,
    - `entry_spotify3M`: `Boolean`,
    - `exit_fixture_comp`: `Boolean`,
    - `exit_peg_comp`: `Boolean`,
    - `exit_pog_comp`: `Boolean`,
    - `exit_pop_pic_1`: `Boolean`,
    - `exit_pop_pic_2`: `Boolean`,
    - `exit_google50k`: `Boolean`,
    - `exit_google100k`: `Boolean`,
    - `exit_google150k`: `Boolean`,
    - `exit_google300k`: `Boolean`,
    - `exit_google500k`: `Boolean`,
    - `exit_spotify1M`: `Boolean`,
    - `exit_spotify3M`: `Boolean`,
    - `assistants_name`: `String`,
    - `q1`: `Boolean`,
    - `q2`: `Boolean`,
    - `q3`: `Boolean`,
    - `q4`: `Boolean`
  - Expected response :
    - Success (status: `201`)
      ```json
        {
          "message": "Success",
          "data": {
            "id_visit": "...",
            "img_store": "...",
            "img_fixture_in": "...",
            "img_fixture_out": "...",
            "visit_date": "...",
            "store_code": "...",
            "entry_fixture_comp": "...",
            "entry_peg_comp": "...",
            "entry_pog_comp":  "...",
            "entry_pop_pic_1": "...",
            "entry_pop_pic_2": "...",
            "entry_google50k": "...",
            "entry_google100k": "...",
            "entry_google150k": "...",
            "entry_google300k": "...",
            "entry_google500k": "...",
            "entry_spotify1M": "...",
            "entry_spotify3M": "...",
            "exit_fixture_comp": "...",
            "exit_peg_comp": "...",
            "exit_pog_comp": "...",
            "exit_pop_pic_1": "...",
            "exit_pop_pic_2": "...",
            "exit_google50k": "...",
            "exit_google100k": "...",
            "exit_google150k": "...",
            "exit_google300k": "...",
            "exit_google500k": "...",
            "exit_spotify1M": "...",
            "exit_spotify3M": "...",
            "assistants_name": "...",
            "q1": "...",
            "q2": "...",
            "q3": "...",
            "q4": "...",
            "tbl_store": {
              "store_code": "...",
              "store_name": "...",
              "retailer_id": "...",
              "dc_id": "...",
              "address": "...",
              "sub_district": "...",
              "district": "...",
              "city": "...",
              "fixture_type_id_1": "...",
              "fixture_type_id_2": "...",
              "fixtureType1": {
                "id": "...",
                "fixture_type": "...",
                "google_50k": "...",
                "google_100k": "...",
                "google_150k": "...",
                "google_300k": "...",
                "google_500k": "...",
                "spotify_1m": "...",
                "spotify_3m": "..."
              },
              "fixtureType2": {
                "id": "...",
                "fixture_type": "...",
                "google_50k": "...",
                "google_100k": "...",
                "google_150k": "...",
                "google_300k": "...",
                "google_500k": "...",
                "spotify_1m": "...",
                "spotify_3m": "..."
              },
            },
            "tbl_dc": {
              "id": "...",
              "DC_name": "..."
            },
            "tbl_retailer": {
                "id": "...",
                "retailer_name": "",
                "initial": "...",
                "total_store": "..."
            }
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find All Visit**
  - URL:
    - `GET /visit`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": [
            {
              "id_visit": "...",
              "img_store": "...",
              "img_fixture_in": "...",
              "img_fixture_out": "...",
              "visit_date": "...",
              "store_code": "...",
              "entry_fixture_comp": "...",
              "entry_peg_comp": "...",
              "entry_pog_comp":  "...",
              "entry_pop_pic_1": "...",
              "entry_pop_pic_2": "...",
              "entry_google50k": "...",
              "entry_google100k": "...",
              "entry_google150k": "...",
              "entry_google300k": "...",
              "entry_google500k": "...",
              "entry_spotify1M": "...",
              "entry_spotify3M": "...",
              "exit_fixture_comp": "...",
              "exit_peg_comp": "...",
              "exit_pog_comp": "...",
              "exit_pop_pic_1": "...",
              "exit_pop_pic_2": "...",
              "exit_google50k": "...",
              "exit_google100k": "...",
              "exit_google150k": "...",
              "exit_google300k": "...",
              "exit_google500k": "...",
              "exit_spotify1M": "...",
              "exit_spotify3M": "...",
              "assistants_name": "...",
              "q1": "...",
              "q2": "...",
              "q3": "...",
              "q4": "...",
              "tbl_store": {
                "store_code": "...",
                "store_name": "...",
                "retailer_id": "...",
                "dc_id": "...",
                "address": "...",
                "sub_district": "...",
                "district": "...",
                "city": "...",
                "fixture_type_id_1": "...",
                "fixture_type_id_2": "...",
                "fixtureType1": {
                  "id": "...",
                  "fixture_type": "...",
                  "google_50k": "...",
                  "google_100k": "...",
                  "google_150k": "...",
                  "google_300k": "...",
                  "google_500k": "...",
                  "spotify_1m": "...",
                  "spotify_3m": "..."
                },
                "fixtureType2": {
                  "id": "...",
                  "fixture_type": "...",
                  "google_50k": "...",
                  "google_100k": "...",
                  "google_150k": "...",
                  "google_300k": "...",
                  "google_500k": "...",
                  "spotify_1m": "...",
                  "spotify_3m": "..."
                },
              },
              "tbl_dc": {
                "id": "...",
                "DC_name": "..."
              },
              "tbl_retailer": {
                  "id": "...",
                  "retailer_name": "",
                  "initial": "...",
                  "total_store": "..."
              }
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)

- **Find A Visit**
  - URL:
    - `GET /visit/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": {
            "id_visit": "...",
            "img_store": "...",
            "img_fixture_in": "...",
            "img_fixture_out": "...",
            "visit_date": "...",
            "store_code": "...",
            "entry_fixture_comp": "...",
            "entry_peg_comp": "...",
            "entry_pog_comp":  "...",
            "entry_pop_pic_1": "...",
            "entry_pop_pic_2": "...",
            "entry_google50k": "...",
            "entry_google100k": "...",
            "entry_google150k": "...",
            "entry_google300k": "...",
            "entry_google500k": "...",
            "entry_spotify1M": "...",
            "entry_spotify3M": "...",
            "exit_fixture_comp": "...",
            "exit_peg_comp": "...",
            "exit_pog_comp": "...",
            "exit_pop_pic_1": "...",
            "exit_pop_pic_2": "...",
            "exit_google50k": "...",
            "exit_google100k": "...",
            "exit_google150k": "...",
            "exit_google300k": "...",
            "exit_google500k": "...",
            "exit_spotify1M": "...",
            "exit_spotify3M": "...",
            "assistants_name": "...",
            "q1": "...",
            "q2": "...",
            "q3": "...",
            "q4": "...",
            "tbl_store": {
              "store_code": "...",
              "store_name": "...",
              "retailer_id": "...",
              "dc_id": "...",
              "address": "...",
              "sub_district": "...",
              "district": "...",
              "city": "...",
              "fixture_type_id_1": "...",
              "fixture_type_id_2": "...",
              "fixtureType1": {
                "id": "...",
                "fixture_type": "...",
                "google_50k": "...",
                "google_100k": "...",
                "google_150k": "...",
                "google_300k": "...",
                "google_500k": "...",
                "spotify_1m": "...",
                "spotify_3m": "..."
              },
              "fixtureType2": {
                "id": "...",
                "fixture_type": "...",
                "google_50k": "...",
                "google_100k": "...",
                "google_150k": "...",
                "google_300k": "...",
                "google_500k": "...",
                "spotify_1m": "...",
                "spotify_3m": "..."
              },
            },
            "tbl_dc": {
              "id": "...",
              "DC_name": "..."
            },
            "tbl_retailer": {
                "id": "...",
                "retailer_name": "",
                "initial": "...",
                "total_store": "..."
            }
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Edit A Visit**
  - URL:
    - `PUT /visit/:id`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `files`: [
        {
          `File`, `img_store`,
        }, {
          `File`, `img_fixture_in`,
        }, {
          `File`, `img_fixture_out`,
        }
      ]
    - `visit_date`: `Date`,
    - `store_code`: `String`,
    - `entry_fixture_comp`: `Boolean`,
    - `entry_peg_comp`: `Boolean`,
    - `entry_pog_comp`:  `Boolean`,
    - `entry_pop_pic_1`: `Boolean`,
    - `entry_pop_pic_2`: `Boolean`,
    - `entry_google50k`: `Boolean`,
    - `entry_google100k`: `Boolean`,
    - `entry_google150k`: `Boolean`,
    - `entry_google300k`: `Boolean`,
    - `entry_google500k`: `Boolean`,
    - `entry_spotify1M`: `Boolean`,
    - `entry_spotify3M`: `Boolean`,
    - `exit_fixture_comp`: `Boolean`,
    - `exit_peg_comp`: `Boolean`,
    - `exit_pog_comp`: `Boolean`,
    - `exit_pop_pic_1`: `Boolean`,
    - `exit_pop_pic_2`: `Boolean`,
    - `exit_google50k`: `Boolean`,
    - `exit_google100k`: `Boolean`,
    - `exit_google150k`: `Boolean`,
    - `exit_google300k`: `Boolean`,
    - `exit_google500k`: `Boolean`,
    - `exit_spotify1M`: `Boolean`,
    - `exit_spotify3M`: `Boolean`,
    - `assistants_name`: `String`,
    - `q1`: `Boolean`,
    - `q2`: `Boolean`,
    - `q3`: `Boolean`,
    - `q4`: `Boolean`
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "id_visit": "...",
            "img_store": "...",
            "img_fixture_in": "...",
            "img_fixture_out": "...",
            "visit_date": "...",
            "store_code": "...",
            "entry_fixture_comp": "...",
            "entry_peg_comp": "...",
            "entry_pog_comp":  "...",
            "entry_pop_pic_1": "...",
            "entry_pop_pic_2": "...",
            "entry_google50k": "...",
            "entry_google100k": "...",
            "entry_google150k": "...",
            "entry_google300k": "...",
            "entry_google500k": "...",
            "entry_spotify1M": "...",
            "entry_spotify3M": "...",
            "exit_fixture_comp": "...",
            "exit_peg_comp": "...",
            "exit_pog_comp": "...",
            "exit_pop_pic_1": "...",
            "exit_pop_pic_2": "...",
            "exit_google50k": "...",
            "exit_google100k": "...",
            "exit_google150k": "...",
            "exit_google300k": "...",
            "exit_google500k": "...",
            "exit_spotify1M": "...",
            "exit_spotify3M": "...",
            "assistants_name": "...",
            "q1": "...",
            "q2": "...",
            "q3": "...",
            "q4": "...",         
            "tbl_store": {
              "store_code": "...",
              "store_name": "...",
              "retailer_id": "...",
              "dc_id": "...",
              "address": "...",
              "sub_district": "...",
              "district": "...",
              "city": "...",
              "fixture_type_id_1": "...",
              "fixture_type_id_2": "...",
              "fixtureType1": {
                "id": "...",
                "fixture_type": "...",
                "google_50k": "...",
                "google_100k": "...",
                "google_150k": "...",
                "google_300k": "...",
                "google_500k": "...",
                "spotify_1m": "...",
                "spotify_3m": "..."
              },
              "fixtureType2": {
                "id": "...",
                "fixture_type": "...",
                "google_50k": "...",
                "google_100k": "...",
                "google_150k": "...",
                "google_300k": "...",
                "google_500k": "...",
                "spotify_1m": "...",
                "spotify_3m": "..."
              },
            },
            "tbl_dc": {
              "id": "...",
              "DC_name": "..."
            },
            "tbl_retailer": {
                "id": "...",
                "retailer_name": "",
                "initial": "...",
                "total_store": "..."
            }
          }
        }
      ```
    - Error (status: `400, 401, 500`)

- **Delete A Visit**
  - URL:
    - `DELETE /visit/:id`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "id_deleted": "..."
        }
      ```
    - Error (status: `400, 401, 500`)


---

## **Report Route**

- **Get Report**
  - URL:
    - `GET /report`
  - Header:
    - `token`: `<Token>`, required
  - Query:
    - `monthly` : `Date` (yyyy-MM-dd),
    - `weekly` : `Date` (yyyy-MM-dd),
    - `daily` : `Date` (yyyy-MM-dd)
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": [
            {
              "Visit Date": "...",
              "NIK": "...",
              "MD Name": "...",
              "Retail": "...",
              "Store Name": "...",
              "Store Code": "...",
              "DC": "...",
              "Address": "...",
              "Sub District": "...",
              "District": "...",
              "City": "...",
              "Documentation Store": "...",
              "Picture (Entry)": "...",
              "Fixture Compliance (Entry)": "...",
              "PEG Compliance (Entry)": "...",
              "POG Compliance (Entry)": "...",
              "POP Pic 1 (Entry)": "...", 
              "POP Pic 2 (Entry)": "...", 
              "Google 50k (Entry)": "...",
              "Google 100k (Entry)": "...",
              "Google 150k (Entry)": "...",
              "Google 300k (Entry)": "...",
              "Google 500k (Entry)": "...",
              "Spotify 1 Month (Entry)": "...",
              "Spotify 3 Month (Entry)": "...",
              "Picture (Exit)": "...",
              "Fixture Compliance (Exit)": "...",
              "PEG Compliance (Exit)": "...",
              "POG Compliance (Exit)": "...",
              "POP Pic 1 (exit)": "...", 
              "POP Pic 2 (exit)": "...", 
              "Google 50k (Exit)": "...",
              "Google 100k (Exit)": "...",
              "Google 150k (Exit)": "...",
              "Google 300k (Exit)": "...",
              "Google 500k (Exit)": "...",
              "Spotify 1 Month (Exit)": "...",
              "Spotify 3 Month (Exit)": "...",
              "Shop Assistants Name": "...",
              "Does the staff know how to activate Gift cards?": "...",
              "Does the staff know how to activate POR?": "...",
              "Does the staff know how to handle customer complaints about Gift card redemption?": "...",
              "Does the staff know about existing promotions for each gift cards? ": "...",
            }
          ]
        }
      ```
    - Error (status: `400, 401, 500`)


---

## **Galery Route**

- **Get Galery**
  - URL:
    - `GET /galery`
  - Header:
    - `token`: `<Token>`, required
  - Query:
    - `month` : `Integer`,
    - `brand` : `String` (Google/Spotify),
    - `retailer` : `Integer`,
    - `fixture` : `Integer`,
    - `store` : `Integer`,
    - `dc` : `Integer`,
    - `supervisior` : `Integer`, //ON PROCCESS
    - `md` : `Integer`
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "total_data": "...",
          "data": [
            {
              "id_visit": "...",
              "img_store": "...",
              "img_fixture_in": "...",
              "img_fixture_out": "...",
              "visit_date": "...",
              "tbl_fixture_type": {
                  "id": "...",
                  "fixture_type": "...",
                  "google_50k": "...",
                  "google_100k": "...",
                  "google_150k": "...",
                  "google_300k": "...",
                  "google_500k": "...",
                  "spotify_1m": "...",
                  "spotify_3m": "..."
              },
              "tbl_user": {
                  "id": "...",
                  "name": "..."
              },
              "tbl_store": {
                  "store_code": "...",
                  "store_name": "...",
                  "city": "...",
                  "tbl_dc": {
                      "id": "...",
                      "DC_name": "...",
                  },
                  "tbl_retailer": {
                      "id": "...",
                      "retailer_name": "...",
                      "initial": "...",
                      "total_store": "...",
                  }
              }
            }
          ]
        }
      ```
    - Error (status: `401, 500`)
  
---


## **Dashboard Route**

- **Get Dashboard**
  - URL:
    - `GET /dashboard`
  - Header:
    - `token`: `<Token>`, required
  - Query:
    - `month` : `Integer`,
    - `brand` : `String` (Google/Spotify),
    - `retailer` : `Integer`,
    - `fixture` : `Integer`,
    - `store` : `Integer`,
    - `dc` : `Integer`,
    - `supervisior` : `Integer`, //ON PROCCESS
    - `md` : `Integer`
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "diagram": {
            "visitCompliance": {
              "total_all_store": "...",
              "store_has_visit": "...",
              "persen": "...",
              "allDataVisit": [
                {
                  "id_visit": "...",
                  "img_store": "...",
                  "img_fixture_in": "...",
                  "img_fixture_out": "...",
                  "visit_date": "...",
                  "store_code": "...",
                  "entry_fixture_comp": "...",
                  "entry_peg_comp": "...",
                  "entry_pog_comp":  "...",
                  "entry_pop_pic_1": "...",
                  "entry_pop_pic_2": "...",
                  "entry_google50k": "...",
                  "entry_google100k": "...",
                  "entry_google150k": "...",
                  "entry_google300k": "...",
                  "entry_google500k": "...",
                  "entry_spotify1M": "...",
                  "entry_spotify3M": "...",
                  "exit_fixture_comp": "...",
                  "exit_peg_comp": "...",
                  "exit_pog_comp": "...",
                  "exit_pop_pic_1": "...",
                  "exit_pop_pic_2": "...",
                  "exit_google50k": "...",
                  "exit_google100k": "...",
                  "exit_google150k": "...",
                  "exit_google300k": "...",
                  "exit_google500k": "...",
                  "exit_spotify1M": "...",
                  "exit_spotify3M": "...",
                  "assistants_name": "...",
                  "q1": "...",
                  "q2": "...",
                  "q3": "...",
                  "q4": "...",       
                  "tbl_store": {
                    "store_code": "...",
                    "store_name": "...",
                    "retailer_id": "...",
                    "dc_id": "...",
                    "address": "...",
                    "sub_district": "...",
                    "district": "...",
                    "city": "...",
                    "fixture_type_id_1": "...",
                    "fixture_type_id_2": "...",
                    "fixtureType1": {
                      "id": "...",
                      "fixture_type": "...",
                      "google_50k": "...",
                      "google_100k": "...",
                      "google_150k": "...",
                      "google_300k": "...",
                      "google_500k": "...",
                      "spotify_1m": "...",
                      "spotify_3m": "..."
                    },
                    "fixtureType2": {
                      "id": "...",
                      "fixture_type": "...",
                      "google_50k": "...",
                      "google_100k": "...",
                      "google_150k": "...",
                      "google_300k": "...",
                      "google_500k": "...",
                      "spotify_1m": "...",
                      "spotify_3m": "..."
                    },
                  },
                  "tbl_dc": {
                    "id": "...",
                    "DC_name": "..."
                  },
                  "tbl_retailer": {
                      "id": "...",
                      "retailer_name": "",
                      "initial": "...",
                      "total_store": "..."
                  }
                }
              ]
            },
            "fixtureCompliance": {
              "entry": "...",
              "exit": "...",
              "dataFixComp": [
                {
                  "id_visit": "...",
                  "img_store": "...",
                  "img_fixture_in": "...",
                  "img_fixture_out": "...",
                  "visit_date": "...",
                  "................" : "..."
                }
              ]
            },
            "POGCompliance": {
              "entry": "...",
              "exit": "...",
              "dataPOGComp": [
                {
                  "id_visit": "...",
                  "img_store": "...",
                  "img_fixture_in": "...",
                  "img_fixture_out": "...",
                  "visit_date": "...",
                  "................" : "..."
                }
              ]
            },
            "PODCompliance": {
              "entry": "...",
              "exit": "...",
              "dataPODCompliance": [
                {
                  "id_visit": "...",
                  "img_store": "...",
                  "img_fixture_in": "...",
                  "img_fixture_out": "...",
                  "visit_date": "...",
                  "................" : "..."
                }
              ]
            },
            "POPCompliance": {
              "entry": 0,
              "exit": 0,
              "dataPOPCompliance": [
                {
                  "id_visit": "...",
                  "img_store": "...",
                  "img_fixture_in": "...",
                  "img_fixture_out": "...",
                  "visit_date": "...",
                  "................" : "..."
                }
              ]
            },
            "instockCompliance": {
              "entryInstockCompliance": "...",
              "exitInstockCompliance": "...",
              "dataInstockCompliance": [
                {
                  "id_visit": "...",
                  "img_store": "...",
                  "img_fixture_in": "...",
                  "img_fixture_out": "...",
                  "visit_date": "...",
                  "................" : "..."
                }
              ]
            },
            "activationKnowHow": {
              "persen": "...",
              "dataActivationKnowHow": [
                {
                  "id_visit": "...",
                  "img_store": "...",
                  "img_fixture_in": "...",
                  "img_fixture_out": "...",
                  "visit_date": "...",
                  "................" : "..."
                }
              ]
            },
            "promotionAwareness": {
              "persen": "...",
              "dataPromotionAwareness": [
                {
                  "id_visit": "...",
                  "img_store": "...",
                  "img_fixture_in": "...",
                  "img_fixture_out": "...",
                  "visit_date": "...",
                  "................" : "..."
                }
              ]
            },
            "complaintHandling": {
              "persen": "...",
              "dataComplaintHandling": [
                {
                  "id_visit": "...",
                  "img_store": "...",
                  "img_fixture_in": "...",
                  "img_fixture_out": "...",
                  "visit_date": "...",
                  "................" : "..."
                }
              ]
            }
          }
        }
      ```
    - Error (status: `401, 500`)
  

---

## **Upload Route**

- **Upload File**
  - URL:
    - `POST /upload`
  - Header:
    - `token`: `<Token>`, required
  - Body:
    - `files` : `File`, ( JIKA UPLOAD FILE SELAIN FILE POP UNTUK IDM )
    - `files`: [ ( JIKA UPLOAD FILE POP UNTUK IDM )
        {
          `File`, `promotion_1`,
        }, {
          `File`, `promotion_2`,
        }
      ]
    - `category_upload_id` : `Integer`,
    - `retailer_id` : `Integer`, 
    - `fixture_type_id` : `Integer`, [For upload POG and Fixture Traits]
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": {
            "id": "...",
            "file": "...",
            "category_upload_id": "...",
            "retailer_id": "...",
            "tbl_category_upload": {
              "id": "...",
              "category": "..."
            }
          }
        }
      ```
    - Error (status: `401, 500`)
  
- **Get File**
  - URL:
    - `GET /upload`
  - Header:
    - `token`: `<Token>`, required
  - Expected response :
    - Success (status: `200`)
      ```json
        {
          "message": "Success",
          "data": [
            {
              "id": 1,
              "category": "POG",
              "retailers": [
                {
                    "retailer_id": "...",
                    "retailer_name": "...",
                    "initial": "...",
                    "file": [
                        {
                            "id": "...",
                            "fixture_type": "...",
                            "POG": "..."
                        },
                    ]
                }
                ....
              ]
            },
            {
              "id": 2,
              "category": "Fixture Traits",
              "retailers": [
                {
                    "retailer_id": "...",
                    "retailer_name": "...",
                    "initial": "...",
                    "file": [
                        {
                            "id": "...",
                            "fixture_type": "...",
                            "fixture_traits": "..."
                        },
                    ]
                }
                ....
              ]
            },
            {
              "id": 3,
              "category": "Promotions",
              "retailers": [
                  {
                      "retailer_id":  "...",
                      "retailer_name": "...",
                      "initial":  "...",
                      "promotion_1": "...",
                      "promotion_2":  "...",
                  },
                  {
                      "retailer_id":  "...",
                      "retailer_name":  "...",
                      "initial":  "...",
                      "promotion": "..."
                  },
                  ....
              ]
            },
            {
              "id": 4,
              "category": "Store List",
              "path": "..."
            },
            {
              "id": 5,
              "category": "Permit",
              "path": "..."
            },
            {
              "id": 6,
              "category": "Visit Instructions",
              "path": "..."
            },
            {
              "id": 7,
              "category": "Store",
              "path": "..."
            }
          ]
        }
      ```
    - Error (status: `401, 500`)
  
