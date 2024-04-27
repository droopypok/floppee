import React, { useEffect, useState } from "react";
import {
  Card,
  Container,
  Grid,
  CardMedia,
  CardActionArea,
  Typography,
} from "@mui/material";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const fetchData = useFetch();
  const navigate = useNavigate();

  const getAllCategories = async () => {
    const res = await fetchData("/categories/", "GET", undefined, undefined);
    if (res.ok) {
      console.log(res.data);
      setAvailableCategories(res.data.categories);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <>
      <Container>
        <br />
        <Typography variant="h3">Categories</Typography>
        <br />
        <Grid container spacing={2}>
          {availableCategories.length > 0 &&
            availableCategories.map((item) => {
              return (
                <>
                  <Grid item sm={4}>
                    <Card>
                      <CardActionArea
                        onClick={() => navigate(`/category/${item.category}`)}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image="https://media.istockphoto.com/id/1334702614/photo/young-man-with-laptop-and-coffee-working-indoors-home-office-concept.jpg?s=612x612&w=0&k=20&c=qAhnrFIMKaObf7Ybf19FVE605g5OVcR7CSt0E3xYSMo="
                        />
                        <Typography variant="h5" align="center">
                          {item.category}
                        </Typography>
                      </CardActionArea>
                    </Card>
                  </Grid>
                </>
              );
            })}
        </Grid>
        {/* <Grid> */}
        {/* <br />
        <h1>Categories</h1>
        <br /> */}
        {/* <Grid container spacing={2}>
            <Grid item sm={2}>
              <Card>
                <CardActionArea onClick={() => console.log("Clicked")}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://media.istockphoto.com/id/1334702614/photo/young-man-with-laptop-and-coffee-working-indoors-home-office-concept.jpg?s=612x612&w=0&k=20&c=qAhnrFIMKaObf7Ybf19FVE605g5OVcR7CSt0E3xYSMo="
                  />
                  <h3>Laptops</h3>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item sm={2}>
              <Card>
                <CardActionArea onClick={() => console.log("Clicked")}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://t3.ftcdn.net/jpg/06/27/53/68/360_F_627536876_2V0uwb7kgtxMgQIOkLQiCHJmAElVwQRA.jpg"
                  />
                  <h3>Clothings</h3>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item sm={2}>
              <Card>
                <CardActionArea onClick={() => console.log("Clicked")}>
                  <CardMedia
                    component="img"
                    height="140"
                    image=" https://media.istockphoto.com/id/1401932226/photo/reading-about-bad-news-using-a-smart-phone.jpg?s=612x612&w=0&k=20&c=p3nXSHkyAo00ZYFUq-bFo72ore_-Hjli8EFq4_pXwko="
                  />
                  <h3>Phones</h3>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item sm={2}>
              <Card>
                <CardActionArea onClick={() => console.log("Clicked")}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZSRvpRnGj-h-QnSpjAPafu4Qunye3BHVENnMUDIulIw&s"
                  />

                  <h3>Foods</h3>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item sm={2}>
              <Card>
                <CardActionArea onClick={() => console.log("Clicked")}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://brushonblock.com/cdn/shop/articles/5-red-hot-sun-protection-mistakes-men-make_655_1669440272.jpg?v=1508780496&width=2048"
                  />
                  <h3>Sunscreen</h3>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item sm={2}>
              <Card>
                <CardActionArea onClick={() => console.log("Clicked")}>
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjK2MZZVLkeqXTPh6zOAUl5ZyzbuzSJ299N_8-ppMDaw&s"
                  />
                  <h3>Jim</h3>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Grid> */}
      </Container>
    </>
  );
};

export default Homepage;
